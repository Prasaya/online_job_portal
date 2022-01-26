require('dotenv').config({ path: './config/.env' });
import express from 'express';
import path from 'path';
import appSetup from '@utils/appSetup';
import apiRoute from '@routes/api/api';

const app = express();

appSetup(app);

app.use('/api', apiRoute);

app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((err, req, res, next) => {
    if (err) {
        console.log(err);
    }
});

module.exports = app;
