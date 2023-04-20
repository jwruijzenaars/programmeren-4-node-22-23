const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');

router.get('/', userController.getAll);
router.get('/:id', userController.getOne);
router.get("/profile",authController.validateToken, userController.getOwn);
router.put('/:id', userController.validateUser, userController.update);
router.delete('/:id', userController.delete);

module.exports = router;