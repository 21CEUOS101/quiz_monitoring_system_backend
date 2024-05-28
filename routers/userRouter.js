const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.post('/', userController.storeIP);
router.post('/location', userController.checkLocation);
router.post('/remove', userController.removeIP);
router.post('/event', userController.storeEvent);
router.post('/audio', userController.storeAudio);

module.exports = router;