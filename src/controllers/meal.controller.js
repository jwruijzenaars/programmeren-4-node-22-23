const assert = require("assert");
const mealDao = require("../daos/meal.dao");
const utils = require("../utils");
const logger = require("../config").logger;

function getCompleteMeal(rawMeal) {
    const meal = {
      isActive: rawMeal.isActive,
      isVega: rawMeal.isVega,
      isVegan: rawMeal.isVegan,
      isToTakeHome: rawMeal.isToTakeHome,
      dateTime: new Date(rawMeal.dateTime),
      maxAmountOfParticipants: rawMeal.maxAmountOfParticipants,
      price: rawMeal.price,
      imageUrl: rawMeal.imageUrl,
      cookId: rawMeal.cookId,
      createDate: new Date(rawMeal.createDate),
      updateDate: new Date(rawMeal.updateDate),
      name: rawMeal.name,
      description: rawMeal.description,
      allergenes: rawMeal.allergenes
    };
    return meal;
  }

const mealController = {
  async validateMeal(req, res, next) {
    try {
      assert(typeof req.body.dateTime === "string", "dateTime must be a date.");

      assert(
        typeof req.body.maxAmountOfParticipants === "number",
        "maxAmountOfParticipants must be a number."
      );
      assert(typeof req.body.price === "number", "price must be a number.");
      assert(
        typeof req.body.imageUrl === "string",
        "imageUrl must be a string."
      );
      assert(typeof req.body.cookId === "number", "cookId must be a number.");
      assert(
        typeof req.body.createDate === "string",
        "createDate must be a date."
      );
      assert(
        typeof req.body.updateDate === "string",
        "updateDate must be a date."
      );
      assert(typeof req.body.name === "string", "name must be a string.");
      assert(
        typeof req.body.description === "string",
        "description must be a string."
      );
      assert(
        typeof req.body.allergenes === "string",
        "allergenes must be a string."
      );
      next();
    } catch (err) {
      res.status(400).json({
        errCode: 400,
        message: "Failed validation",
        error: err.toString(),
        datetime: new Date().toISOString(),
      });
    }
  },

  async create(req, res, next) {
    logger.trace("mealController create called");
    try {
        const meal = getCompleteMeal(req.body);
      await mealDao.create(meal, (err, result) => {
        utils.handleResult(res, next, err, result);
        });
    } catch (err) {
      utils.handleResult(res, next, err, null);
    }
  },

  async getAll(req, res, next) {
    logger.trace("mealController getAll called");
    try {
      await mealDao.getAll((err, result) => {
        utils.handleResult(res, next, err, result);
      });
    } catch (err) {
      utils.handleResult(res, next, err, null);
    }
  },

  async getOne(req, res, next) {
    logger.trace("mealController getOne called");
    try {
      await mealDao.getOne(req.params.id, (err, result) => {
        utils.handleResult(res, next, err, result);
      });
    } catch (err) {
      utils.handleResult(res, next, err, null);
    }
  },

  async update(req, res, next) {
    logger.trace("mealController update called");
    try {
        const meal = getCompleteMeal(req.body);
      await mealDao.update(req.params.id, meal, (err, result) => {
        utils.handleResult(res, next, err, result);
      });
    } catch (err) {
      utils.handleResult(res, next, err, null);
    }
  },

  async delete(req, res, next) {
    logger.trace("mealController delete called");
    try {
      await mealDao.delete(req.params.id, (err, result) => {
        utils.handleResult(res, next, err, result);
        });
    } catch (err) {
      utils.handleResult(res, next, err, null);
    }
  },
};

module.exports = mealController;
