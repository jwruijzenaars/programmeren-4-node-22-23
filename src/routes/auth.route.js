const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/', authController.validateLogin, authController.login);
router.get("/renew", authController.renewToken);

module.exports = router;