const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get('/', userController.getAll);
router.get('/:id', userController.getOne);
router.get("/own/:id", userController.getOwn);
router.put('/:id', userController.validateUser, userController.update);
router.delete('/:id', userController.delete);

module.exports = router;