const express = require('express');
const router = express.Router();
const characterController = require('../controllers/characterController');
const timeController = require('../controllers/timeController');

router.get('/characters', characterController.getAllCharacters);
router.get('/times', timeController.getAllTimes);

module.exports = router;