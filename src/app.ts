import './env';
import express from 'express';
import path from 'path';
import appSetup from '@utils/appSetup';
import apiRoute from '@routes/api/api';

const app = express();

appSetup(app);

app.use('/api', apiRoute);

app.use('*', (req, res) => {
    res.sendFile('index.html', { root: './dist/public' });
});

app.use((err, req, res, next) => {
    if (err) {
        console.log(err);
    }
});

export default app;
