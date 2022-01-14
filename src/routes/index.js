var express = require('express');
var router = express.Router();
var apiRoute = require('./api/api');

router.use('/api', apiRoute);


module.exports = router;
