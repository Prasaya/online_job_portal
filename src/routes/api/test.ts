import logger from '@utils/logger';
import express from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';

const router = express.Router();

router.get('/', (req, res) => {
  const html = `
            <form method="post" action="/api/test" enctype="multipart/form-data">
                <label for="file">File:
                    <input type="file" name="profilePicture" id="file"></input>
                </label>
                <input type="submit">Submit</input>
            </form>
        `;
  res.send(html);
});

router.get('/image/:fileName?', (req, res) => {
  if (!req.params.fileName) {
    res.status(400).json({ message: 'No file name provided!', success: false });
    return;
  }
  const filePath = path.resolve('.', 'images', req.params.fileName);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(400).json({ message: 'File not found!', success: false });
    }
  });
});

router.post(
  '/',
  fileUpload({
    createParentPath: true,
    debug: false,
    abortOnLimit: true,
    useTempFiles: true,
    tempFileDir: '/tmp/',
  }),
  async (req, res) => {
    if (!req.files || !req.files.profilePicture) {
      res
        .status(400)
        .json({ message: 'No files were uploaded!', success: false });
      return;
    }
    const file = req.files.profilePicture as fileUpload.UploadedFile;
    try {
      await file.mv(path.resolve('.', 'images', file.name));
    } catch (err) {
      logger.log(err);
      res
        .status(500)
        .json({ message: 'Something went wrong!', success: false });
      return;
    }
    res.json({
      name: file.name,
      size: file.size,
      encoding: file.encoding,
      mimetype: file.mimetype,
      truncated: file.truncated,
    });
  },
);

export default router;
