const express = require('express');
const router = express.Router();
const path = require('path');

router.get('^/$|index(.html)?', (request, response) => {
    response.sendFile(path.join(__dirname, '..', '..', 'public', 'views', 'index.html'));
});
router.get('^/$|unit-info(.html)?', (request, response) => {
    response.sendFile(path.join(__dirname, '..', '..', 'public', 'views', 'unit-info.html'));
});

module.exports = router;