const express = require('express');
const router = express.Router();
const characterController = require('../controllers/characterController');
const timeController = require('../controllers/timeController');
const saddleBagController = require('../controllers/saddlebagController');
const preciousStoneController = require('../controllers/preciousStoneController');

router.get('/characters', characterController.getAllCharacters);
router.get('/characters/unpopulated', characterController.getAllUnpopulatedCharacters);
router.get('/getTimes', timeController.getAllTimes);
router.get('/saddlebags', saddleBagController.getAllSaddleBags);
router.get('/preciousStones', preciousStoneController.getAllPreciousStones);

router.post('/postTime', timeController.postTime);

module.exports = router;