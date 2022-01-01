const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));

const indexRouter = require('./routes/index');
app.use('/', indexRouter);

app.use(function (req, res, next) {
    res.json({ message: 'Error 404: Page not found.', success: false });
});

module.exports = app;
