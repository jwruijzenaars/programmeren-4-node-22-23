const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/login', authController.validateLogin, authController.login);
router.post('/register', authController.validateRegister, authController.register);
router.get("/renew", authController.renewToken);

module.exports = router;