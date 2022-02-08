import './env';
import express, { ErrorRequestHandler } from 'express';
import apiRoute from '@routes/api/api';
import appSetup from '@utils/appSetup';
import logger from '@utils/logger';

const app = express();

appSetup(app);

app.use(
    '/api',
    apiRoute,
);

app.use(
    '*',
    (_req, res) => {
        res.sendFile(
            'index.html',
            { root: './dist/public' },
        );
    },
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- this is a global error handler
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err) {
        logger.error(err);
    }
};
app.use(errorHandler);

export default app;
