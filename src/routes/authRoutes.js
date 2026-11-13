const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/auth/config', authController.config);
router.post('/auth/google', authController.google);

module.exports = router;
