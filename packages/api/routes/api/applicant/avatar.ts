import { isApplicant } from '@middleware/authorization';
import { updatePicture } from '@models/User';
import { User } from '@typings/User';
import express from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';

const router = express.Router();

router.get('/', (req, res) => {
  const userData = req.user?.user as User;
  const fileName = userData.basics.picture;
  if (!fileName) {
    res.status(404).json({ message: 'No avatar found!', success: false });
    return;
  }
  res.sendFile(path.resolve('.', 'images', fileName));
});

router.put(
  '/',
  fileUpload({
    createParentPath: true,
    debug: false,
    limits: { fileSize: 1024 * 1024 },
    abortOnLimit: true,
    useTempFiles: true,
    tempFileDir: '/tmp/',
  }),
  async (req, res) => {
    if (!req.files || !req.files.avatar) {
      res
        .status(400)
        .json({ message: 'No files were uploaded!', success: false });
      return;
    }
    if (Array.isArray(req.files.avatar)) {
      res
        .status(400)
        .json({ message: 'Multiple files were uploaded!', success: false });
      return;
    }
    const file = req.files.avatar;
    const json = await updatePicture(req.user!.user.basics.id, file);
    res.json(json);
  },
);

export default router;
