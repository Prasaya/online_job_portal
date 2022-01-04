var express = require('express');
var router = express.Router();
var apiRoute = require('./api/api');

router.use('/api', apiRoute);

router.get('/', (req, res, next) => {
  res.json({ message: 'This is the home page!', success: true });
});

module.exports = router;
