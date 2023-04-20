const logger = require("../config").logger;
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
        message: "Failed validation",
        error: err.toString(),
        datetime: new Date().toISOString(),
      });
    }
  },

  async createParticipation(req, res) {
    try {
      await participationDao.createParticipation(req.params.mealId, req.body.userId, (err, result) => {
        res.status(200).send({
          status: 200,
          message: `User with ID ${req.body.userId} is signed up for meal with ID ${req.params.mealId}`,
          datetime: new Date().toISOString(),
        })
      });
    } catch (err) {
      utils.handleResult(res, next, err, null);
    }
  },

  async getParticipants(req, res) {
    try {
      await participationDao.getParticipants(req.params.mealId, (err, result) => {
        utils.handleResult(res, next, err, result);
      });
    } catch (err) {
      utils.handleResult(res, next, err, null);
    }
  },

  async getParticipant(req, res) {
    try {
      await participationDao.getParticipant(req.params.mealId, req.params.userId, (err, result) => {
        utils.handleResult(res, next, err, result);
      });
    } catch (err) {
      utils.handleResult(res, next, err, null);
    }
  },

  async deleteParticipation(req, res) {
    try {
      await participationDao.delete(req.params.mealId, req.body.userId, (err, result) => {
        res.status(200).send({
          status: 200,
          message: `User with ID ${req.body.userId} is signed off for meal with ID ${req.params.mealId}`,
          datetime: new Date().toISOString(),
        })
      });
    } catch (err) {
      utils.handleResult(res, next, err, null);
    }
  },
};

module.exports = praticipationController;