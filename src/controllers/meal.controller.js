const assert = require("assert");
const mealDao = require("../daos/meal.dao");
const utils = require("../utils");
const logger = require("../config").logger;

function getCompleteMeal(rawMeal, userId) {
  const meal = {
    isActive: rawMeal.isActive,
    isVega: rawMeal.isVega,
    isVegan: rawMeal.isVegan,
    isToTakeHome: rawMeal.isToTakeHome,
    dateTime: new Date(rawMeal.dateTime),
    maxAmountOfParticipants: rawMeal.maxAmountOfParticipants,
    price: rawMeal.price,
    imageUrl: rawMeal.imageUrl,
    cookId: userId,
    createDate: new Date(rawMeal.createDate),
    updateDate: new Date(rawMeal.updateDate),
    name: rawMeal.name,
    description: rawMeal.description,
    allergenes: rawMeal.allergenes,
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
      res.status(406).json({
        errCode: 406,
        message: "Failed validation",
        error: err.toString(),
        datetime: new Date().toISOString(),
      });
    }
  },

  async create(req, res, next) {
    logger.trace("mealController create called");
    try {
      const userId = req.userId;
      const meal = getCompleteMeal(req.body, userId);
      await mealDao.create(meal, (err, result) => {
        if (result) {
          if (result.length === 0) {
            res.status(400).json({
              status: 400,
              message: "Failed to create meal",
              datetime: new Date().toISOString(),
            });
          } else {
            res.status(201).json({
              status: 201,
              message: "Meal created",
              data: result.rows[0],
              datetime: new Date().toISOString(),
            });
          }
        } else {
          res.status(400).json({
            status: 400,
            message: "Failed to create meal",
            datetime: new Date().toISOString(),
          });
        }
      });
    } catch (err) {
      res.status(400).json({
        status: 400,
        message: "Failed to create meal",
        datetime: new Date().toISOString(),
      });
    }
  },

  async getAll(req, res, next) {
    logger.trace("mealController getAll called");
    try {
      await mealDao.getAll((err, result) => {
        if (result) {
          if (result.length === 0) {
            res.status(404).json({
              status: 404,
              message: "No meals found",
              datetime: new Date().toISOString(),
            });
          } else {
            res.status(200).json({
              status: 200,
              message: "Meals retrieved",
              data: result.rows,
              datetime: new Date().toISOString(),
            });
          }
        }
      });
    } catch (err) {
      res.status(400).json({
        status: 400,
        message: "Couldn't get meals",
        datetime: new Date().toISOString(),
      });
    }
  },

  async getOne(req, res, next) {
    logger.trace("mealController getOne called");
    try {
      await mealDao.getOne(req.params.mealId, (err, result) => {
        if (result) {
          if (result.length === 0) {
            res.status(404).json({
              status: 404,
              message: "No meal found",
              datetime: new Date().toISOString(),
            });
          } else {
            res.status(200).json({
              status: 200,
              message: "Meal retrieved",
              data: result.rows[0],
              datetime: new Date().toISOString(),
            });
          }
        } else {
          res.status(400).json({
            status: 400,
            message: "Couldn't get meal with id: " + req.params.mealId,
            datetime: new Date().toISOString(),
          });
        }
      });
    } catch (err) {
      res.status(400).json({
        status: 400,
        message: "Couldn't get meal with id: " + req.params.mealId,
        datetime: new Date().toISOString(),
      });
    }
  },

  async update(req, res, next) {
    logger.trace("mealController update called");
    try {
      const userId = req.userId;
      const meal = getCompleteMeal(req.body, userId);
      if (meal.cookId === userId) {
        await mealDao.update(req.params.mealId, meal, (err, result) => {
          if (result) {
            if (result.length === 0) {
              res.status(404).json({
                status: 404,
                message: "Couldn't find meal to update",
                datetime: new Date().toISOString(),
              });
            } else {
              res.status(200).json({
                status: 200,
                message: "Meal updated",
                data: result.rows[0],
                datetime: new Date().toISOString(),
              });
            }
          } else {
            res.status(400).json({
              status: 400,
              message: "Couldn't update meal with id: " + req.params.mealId,
              datetime: new Date().toISOString(),
            });
          }
        });
      } else {
        res.status(403).json({
          status: 403,
          message:
            "Not authorized to update meal with id: " + req.params.mealId,
          datetime: new Date().toISOString(),
        });
      }
    } catch (err) {
      res.status(400).json({
        status: 400,
        message: "Couldn't update meal with id: " + req.params.mealId,
        datetime: new Date().toISOString(),
      });
    }
  },

  async delete(req, res, next) {
    logger.trace("mealController delete called");
    try {
      var oldMeal;
      await mealDao.getOne(req.params.mealId, (err, result) => {
        if (result) {
          oldMeal = result.rows[0];
        } else {
          res.status(404).json({
            status: 404,
            message: "Couldn't find meal to delete",
            datetime: new Date().toISOString(),
          });
        }
      });
      if (oldMeal.cookId === req.userId) {
      await mealDao.delete(req.params.mealId, (err, result) => {
        if(err) {
          res.status(400).json({
            status: 400,
            message: "Couldn't delete meal with id: " + req.params.mealId,
            datetime: new Date().toISOString(),
          });
        } else {
          res.status(200).json({
            status: 200,
            message: `Meal with id ${oldMeal.id} deleted`,
            datetime: new Date().toISOString(),
          });
        }
      });
      } else {
        res.status(403).json({
          status: 403,
          message:
            "Not authorized to delete meal with id: " + req.params.mealId,
          datetime: new Date().toISOString(),
        });
      }
    } catch (err) {
      res.status(400).json({
        status: 400,
        message: "Couldn't delete meal with id: " + req.params.mealId,
        datetime: new Date().toISOString(),
      });
    }
  },
};

module.exports = mealController;
