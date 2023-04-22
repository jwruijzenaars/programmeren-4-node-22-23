const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authController = require("../controllers/auth.controller");

router.get("/", userController.getAll);
router.get("/own/profile", authController.validateToken, userController.getOwn);
router.get("/:userId", authController.validateToken, userController.getOne);
router.put("/:userId", authController.validateToken, userController.validateUser, userController.update);
router.delete("/:userId", authController.validateToken, userController.delete);
router.post("/", authController.validateRegister, authController.register);

module.exports = router;
