const express = require('express');
const router = express.Router();
const mealController = require('../controllers/meal.controller');
const participationController = require('../controllers/participation.controller');

router.get('/', mealController.getAll);
router.get('/:id', mealController.getOne);
router.post('/', mealController.validateMeal, mealController.create);
router.put('/:id', mealController.validateMeal, mealController.update);
router.delete('/:id', mealController.delete);

router.post('/:mealId/participate', participationController.validateParticipation, participationController.createParticipation);
router.put('/:mealId/participate', participationController.deleteParticipation);
router.get('/:mealId/participate', participationController.getParticipants);
router.get('/:mealId/participate/:userId', participationController.getParticipant);

module.exports = router;