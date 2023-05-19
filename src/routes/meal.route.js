const express = require('express');
const router = express.Router();
const mealController = require('../controllers/meal.controller');
const participationController = require('../controllers/participation.controller');
const authController = require('../controllers/auth.controller');

router.get('/', mealController.getAll);
router.get('/:mealId', mealController.getOne);
router.post('/', authController.validateToken, mealController.validateMeal, mealController.create);
router.put('/:mealId', authController.validateToken, mealController.validateMeal, mealController.update);
router.delete('/:mealId', authController.validateToken, mealController.delete);

router.post('/:mealId/participate', authController.validateToken, participationController.validateParticipation, participationController.createParticipation);
router.delete('/:mealId/participate', authController.validateToken, participationController.deleteParticipation);
router.get('/:mealId/participate', authController.validateToken, participationController.getParticipants);
router.get('/:mealId/participate/:userId', authController.validateToken, participationController.getParticipant);

module.exports = router;