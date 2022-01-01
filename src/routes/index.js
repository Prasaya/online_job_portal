var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
  res.json({ message: 'This is the home page.', success: true });
});

module.exports = router;
