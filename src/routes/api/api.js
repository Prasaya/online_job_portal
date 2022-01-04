var express = require('express');
var router = express.Router();

router.get('/connection', (req, res, next) => {
    const url = req.protocol + '://' + req.get('host') + req.originalUrl;
    const ip = req.ip;
    res.json({ url, ip, envPort: process.env.PORT || 'unknown', success: true });
});

router.get('/', (req, res, next) => {
    res.json({ message: 'This is the api page!', success: true });
});

module.exports = router;
