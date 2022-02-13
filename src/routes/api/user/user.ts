import isLoggedIn from '@middleware/isLoggedIn';
import { searchUser } from '@root/models/Auth';
import logger from '@root/utils/logger';
import express from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';
import { User } from '@typings/User';
import connection from '@utils/dbSetup';

const router = express.Router();

router.get(
    '/',
    isLoggedIn,
    (req, res) => {
        res.json({
            user: req.user,
            success: true,
        });
    },
);

router.get(
    '/avatar',
    isLoggedIn,
    (req, res) => {
        const userData = req.user?.basics as User;
        // TODO: Use middleware for RBAC
        if (userData.role !== 'Users') {
            res.status(400).json({ message: 'You are not a user!', success: false });
            return;
        }
        const fileName = userData.picture;
        if (!fileName) {
            res.status(400).json({ message: 'No avatar found!', success: false });
            return;
        }
        res.sendFile(path.resolve(
            '.',
            'images',
            fileName,
        ));
    },
);

router.post(
    '/avatar',
    isLoggedIn,
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
            res.status(400).json({ message: 'No files were uploaded!', success: false });
            return;
        }
        const file = req.files.avatar as fileUpload.UploadedFile;
        try {
            const fileName = req.user.basics.id + path.extname(file.name);
            await file.mv(path.resolve(
                '.',
                'images',
                fileName,
            ));
            await connection.query(
                'UPDATE users SET picture = ? WHERE uid = ?',
                [
                    fileName,
                    req.user?.basics.id,
                ],
            );
            res.json({
                name: file.name,
                size: file.size,
                encoding: file.encoding,
                mimetype: file.mimetype,
                truncated: file.truncated,
                url: fileName,
            });
        } catch (err) {
            logger.error(err);
            res.status(500).json({ message: 'Something went wrong!', success: false });
        }
    },
);

router
    .get(
        '/:uid',
        async (req, res) => {
            const user = await searchUser(
                'Users',
                req.params.uid,
            );
            if (user === null) {
                return res.status(404).json({ message: 'Could not find user.', success: false });
            }
            return res.json({
                user,
                success: true,
            });
        },
    );

export default router;
