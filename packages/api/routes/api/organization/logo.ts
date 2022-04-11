import { updateLogo } from '@models/Organization';
import { updatePicture } from '@models/User';
import { Organization } from '@typings/Organization';
import { User } from '@typings/User';
import express from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';

const router = express.Router();

router.get('/', (req, res) => {
  const userData = req.user?.user as Organization;
  const fileName = userData.basics.logo;
  if (!fileName) {
    res.status(404).json({ message: 'No logo found!', success: false });
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
    if (!req.files || !req.files.logo) {
      res
        .status(400)
        .json({ message: 'No files were uploaded!', success: false });
      return;
    }
    if (Array.isArray(req.files.logo)) {
      res
        .status(400)
        .json({ message: 'Multiple files were uploaded!', success: false });
      return;
    }
    const file = req.files.logo;
    const json = await updateLogo(req.user!.user.basics.id, file);
    res.json(json);
  },
);

export default router;
