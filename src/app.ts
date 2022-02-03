import './env';
import express from 'express';
import appSetup from '@utils/appSetup';
import apiRoute from '@routes/api/api';
import logger from '@utils/logger';

const app = express();

appSetup(app);

app.use('/api', apiRoute);

app.use('*', (req, res) => {
    res.sendFile('index.html', { root: './dist/public' });
});

app.use((err, req, res, next) => {
    if (err) {
        logger.error(err);
    }
});

export default app;
