const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "online_job_portal_frontend", "build")));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));

app.use('/api', require('./routes/api/api'));

app.use(function (req, res, next) {
    res.json({ message: 'Error 404: Page not found.', success: false });
});

module.exports = app;
