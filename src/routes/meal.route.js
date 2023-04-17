const express = require('express');
const router = express.Router();
const mealController = require('../controllers/meal.controller');

router.get('/', mealController.getAll);
router.get('/:id', mealController.getOne);
router.post('/', mealController.validateMeal, mealController.create);
router.put('/:id', mealController.validateMeal, mealController.update);
router.delete('/:id', mealController.delete);

module.exports = router;