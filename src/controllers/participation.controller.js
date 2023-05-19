const logger = require("../config").logger;
const mealDao = require("../daos/meal.dao");
const participationDao = require("../daos/participation.dao");
const utils = require("../utils");
const assert = require("assert");

const praticipationController = {
  async validateParticipation(req, res, next) {
    try {
      assert(typeof req.params.mealId === "string", "mealId must be a string.");
      assert(typeof req.body.userId === "string", "userId must be a string.");
      next();
    } catch {
      res.status(406).json({
        errCode: 406,
        message: "Failed validation" + err.toString(),
        data: "",
        datetime: new Date().toISOString(),
      });
    }
  },

  async createParticipation(req, res) {
    try {
      const paramMealId = req.params.mealId;
      await mealDao.getOne(paramMealId, (err, result) => {
        if (result.length === 0) {
          res.status(404).send({
            status: 404,
            message: `Meal with ID ${paramMealId} not found`,
            data: "",
            datetime: new Date().toISOString(),
          });
        } else if (result) {
          const maxParticipants = result[0].maxParticipants;

          participationDao.getParticipation(paramMealId, (err, result) => {
            if (result.length >= maxParticipants) {
              res.status(403).send({
                status: 403,
                message: `Meal with ID ${paramMealId} is already full`,
                data: "",
                datetime: new Date().toISOString(),
              });
            } else if (err) {
              res.status(500).send({
                status: 500,
                message: `Couldn't be signed up for meal with ID ${paramMealId} `,
                data: "",
                datetime: new Date().toISOString(),
              });
            } else {
              participationDao.createParticipation(
                req.params.mealId,
                req.body.userId,
                (err, result) => {
                  if (err) {
                    res.status(409).send({
                      status: 409,
                      message: `User with ID ${req.body.userId} is couldn't be signed up for meal with ID ${req.params.mealId}`,
                      data: "",
                      datetime: new Date().toISOString(),
                    });
                  } else {
                    res.status(201).send({
                      status: 201,
                      message: `User with ID ${req.body.userId} is signed up for meal with ID ${req.params.mealId}`,
                      data: "",
                      datetime: new Date().toISOString(),
                    });
                  }
                }
              );
            }
          });
        } else {
          res.status(400).send({
            status: 400,
            message: `User with ID ${req.body.userId} is couldn't be signed up for meal with ID ${req.params.mealId}`,
            data: "",
            datetime: new Date().toISOString(),
          });
        }
      });
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: `Couldn't be signed up for meal with ID ${req.params.mealId} `,
        data: "",
        datetime: new Date().toISOString(),
      });
    }
  },

  async getParticipants(req, res) {
    try {
      await participationDao.getParticipants(
        req.params.mealId,
        (err, result) => {
          if (result.length === 0) {
            res.status(404).send({
              status: 404,
              message: `No participants for meal with ID ${req.params.mealId}`,
              data: "",
              datetime: new Date().toISOString(),
            });
          } else if (result) {
            res.status(200).send({
              status: 200,
              message: `Participants for meal with ID ${req.params.mealId}`,
              data: result,
              datetime: new Date().toISOString(),
            });
          } else {
            res.status(400).send({
              status: 400,
              message: `Couldn't get participants for meal with ID ${req.params.mealId}`,
              data: "",
              datetime: new Date().toISOString(),
            });
          }
        }
      );
    } catch (err) {
      res.send(500).send({
        status: 500,
        message: `Couldn't get participants for meal with ID ${req.params.mealId}`,
        data: "",
        datetime: new Date().toISOString(),
      });
    }
  },

  async getParticipant(req, res) {
    try {
      const paramMealId = req.params.mealId;
      const reqUserId = req.body.userId;
      await participationDao.getParticipant(
        paramMealId,
        reqUserId,
        (err, result) => {
          if (result.length === 0) {
            res.status(404).send({
              status: 404,
              message: `User with ID ${reqUserId} is not signed up for meal with ID ${paramMealId}`,
              data: "",
              datetime: new Date().toISOString(),
            });
          } else if (result) {
            res.status(200).send({
              status: 200,
              message: `User with ID ${reqUserId} is signed up for meal with ID ${paramMealId}`,
              data: result,
              datetime: new Date().toISOString(),
            });
          } else {
            res.status(400).send({
              status: 400,
              message: `Couldn't get participant for meal with ID ${paramMealId}`,
              data: "",
              datetime: new Date().toISOString(),
            });
          }
        }
      );
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: `Couldn't get participant for meal with ID ${req.params.mealId}`,
        data: "",
        datetime: new Date().toISOString(),
      });
    }
  },

  async deleteParticipation(req, res) {
    try {
      const paramMealId = req.params.mealId;
      const reqUserId = req.body.userId;
      await participationDao.delete(paramMealId, reqUserId, (err, result) => {
        if (result.length === 0) {
          res.status(404).send({
            status: 404,
            message: `User with ID ${reqUserId} is not signed up for meal with ID ${paramMealId}`,
            data: "",
            datetime: new Date().toISOString(),
          });
        } else if (result) {
          res.status(200).send({
            status: 200,
            message: `User with ID ${reqUserId} is signed off for meal with ID ${reqUserId}`,
            data: "",
            datetime: new Date().toISOString(),
          });
        } else {
          res.status(400).send({
            status: 400,
            message: `Couldn't sign off user with ID ${reqUserId} for meal with ID ${paramMealId}`,
            data: "",
            datetime: new Date().toISOString(),
          });
        }
      });
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: `Couldn't sign off user with ID ${reqUserId} for meal with ID ${paramMealId}`,
        data: "",
        datetime: new Date().toISOString(),
      });
    }
  },
};

module.exports = praticipationController;
