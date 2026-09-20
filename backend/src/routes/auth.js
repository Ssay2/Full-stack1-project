const express = require('express');
const { signup, login, demo } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/demo', demo);

module.exports = router;