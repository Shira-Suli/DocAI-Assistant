const express = require('express');
const router = express.Router();
const { handleAsk } = require('../controllers/askController');

router.post('/', handleAsk);

module.exports = router;
