const logger = require("../config").logger;
const mealDao = require("../daos/meal.dao");
const participationDao = require("../daos/participation.dao");
const utils = require("../utils");
const assert = require("assert");

const praticipationController = {
  async validateParticipation(req, res, next) {
    logger.trace("participationController validateParticipation called");
    logger.debug("req.body: ");
    logger.debug(req.userId);
    logger.debug(req.params.mealId);
    try {
      assert(typeof req.params.mealId === "string", "mealId must be a string.");
      assert(typeof req.userId === "number", "userId must be a number.");
      next();
    } catch (err) {
      res.status(400).json({
        errCode: 400,
        message: "Failed validation" + err.toString(),
        data: "",
        datetime: new Date().toISOString(),
      });
    }
  },

  async createParticipation(req, res) {
    logger.trace("participationController createParticipation called");
    try {
      const paramMealId = req.params.mealId;
      const reqUserId = req.userId;
      console.log(reqUserId);
      console.log(paramMealId);
      await mealDao.getOne(paramMealId, (err, result) => {
        if (result.length === 0) {
          res.status(404).send({
            status: 404,
            message: `Meal with id ${paramMealId} not found`,
            data: "",
            datetime: new Date().toISOString(),
          });
        } else if (result) {
          const maxParticipants = result[0].maxAmountOfParticipants;
          console.log(maxParticipants);

          participationDao.getParticipants(paramMealId, (err, partResult) => {
            if (partResult.length >= maxParticipants) {
              res.status(200).send({
                status: 200,
                message: `Meal with id ${paramMealId} is already full`,
                data: "",
                datetime: new Date().toISOString(),
              });
            } else if (err) {
              res.status(500).send({
                status: 500,
                message: `Couldn't be signed up for meal with id ${paramMealId} `,
                data: "",
                datetime: new Date().toISOString(),
              });
            } else {
              participationDao.createParticipation(
                paramMealId,
                reqUserId,
                (err, result) => {
                  if (err) {
                    res.status(409).send({
                      status: 409,
                      message: `User with id ${reqUserId} is couldn't be signed up for meal with id ${paramMealId}}`,
                      data: "",
                      datetime: new Date().toISOString(),
                    });
                  } else {
                    res.status(200).send({
                      status: 200,
                      message: `User with id ${reqUserId} is signed up for meal with id ${paramMealId}`,
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
            message: `User with id ${req.body.userId} is couldn't be signed up for meal with id ${req.params.mealId}`,
            data: "",
            datetime: new Date().toISOString(),
          });
        }
      });
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: `Couldn't be signed up for meal with id ${req.params.mealId} `,
        data: "",
        datetime: new Date().toISOString(),
      });
    }
  },

  async getParticipants(req, res) {
    logger.trace("participationController getParticipants called");
    const paramMealId = req.params.mealId;
    const reqUserId = req.body.userId;
    try {
      await mealDao.getOne(paramMealId, (err, result) => {
        if (result.length === 0) {
          res.status(404).send({
            status: 404,
            message: `Meal with id ${paramMealId} not found`,
            data: "",
            datetime: new Date().toISOString(),
          });
        } else if (result[0]) {
          if (result[0].cookId !== reqUserId) {
            res.status(403).send({
              status: 403,
              message: `User with id ${reqUserId} is not allowed to get participants for meal with id ${paramMealId}`,
              data: "",
              datetime: new Date().toISOString(),
            });
          } else {
            participationDao.getParticipants(paramMealId, (err, result) => {
              if (result.length === 0) {
                res.status(404).send({
                  status: 404,
                  message: `No participants for meal with id ${paramMealId}`,
                  data: "",
                  datetime: new Date().toISOString(),
                });
              } else if (result) {
                res.status(200).send({
                  status: 200,
                  message: `Participants for meal with id ${paramMealId}`,
                  data: result,
                  datetime: new Date().toISOString(),
                });
              } else {
                res.status(400).send({
                  status: 400,
                  message: `Couldn't get participants for meal with id ${paramMealId}`,
                  data: "",
                  datetime: new Date().toISOString(),
                });
              }
            });
          }
        } else {
          res.status(400).send({
            status: 400,
            message: `Couldn't get participants for meal with id ${paramMealId}`,
            data: "",
            datetime: new Date().toISOString(),
          });
        }
      });
    } catch (err) {
      res.send(500).send({
        status: 500,
        message: `Couldn't get participants for meal with id ${paramMealId}`,
        data: "",
        datetime: new Date().toISOString(),
      });
    }
  },

  async getParticipant(req, res) {
    logger.trace("participationController getParticipant called");
    try {
      const paramMealId = req.params.mealId;
      const reqUserId = req.body.userId;
      await mealDao.getOne(paramMealId, (err, result) => {
        if (result.length === 0) {
          res.status(404).send({
            status: 404,
            message: `Meal with id ${paramMealId} not found`,
            data: "",
            datetime: new Date().toISOString(),
          });
        } else if (result[0]) {
          if (result[0].cookId !== reqUserId) {
            res.status(403).send({
              status: 403,
              message: `User with id ${reqUserId} is not allowed to get participants for meal with id ${paramMealId}`,
              data: "",
              datetime: new Date().toISOString(),
            });
          } else {
            participationDao.getParticipant(
              paramMealId,
              reqUserId,
              (err, result) => {
                if (result.length === 0) {
                  res.status(404).send({
                    status: 404,
                    message: `User with id ${reqUserId} is not signed up for meal with id ${paramMealId}`,
                    data: "",
                    datetime: new Date().toISOString(),
                  });
                } else if (result) {
                  res.status(200).send({
                    status: 200,
                    message: `User with id ${reqUserId} is signed up for meal with id ${paramMealId}`,
                    data: result,
                    datetime: new Date().toISOString(),
                  });
                } else {
                  res.status(400).send({
                    status: 400,
                    message: `Couldn't get participant for meal with id ${paramMealId}`,
                    data: "",
                    datetime: new Date().toISOString(),
                  });
                }
              }
            );
          }
        } else {
          res.status(400).send({
            status: 400,
            message: `Couldn't get participant for meal with id ${paramMealId}`,
            data: "",
            datetime: new Date().toISOString(),
          });
        }
      });
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: `Couldn't get participant for meal with id ${req.params.mealId}`,
        data: "",
        datetime: new Date().toISOString(),
      });
    }
  },

  async deleteParticipation(req, res) {
    logger.trace("participationController deleteParticipation called");
    const paramMealId = req.params.mealId;
    const reqUserId = req.userId;
    try {
      await mealDao.getOne(paramMealId, (err, result) => {
        if (result.length === 0) {
          res.status(404).send({
            status: 404,
            message: `Meal with id ${paramMealId} not found`,
            data: "",
            datetime: new Date().toISOString(),
          });
        } else if (result) {
          participationDao.getParticipant(
            paramMealId,
            reqUserId,
            (err, result) => {
              if (result.length === 0) {
                res.status(404).send({
                  status: 404,
                  message: `User with id ${reqUserId} is not signed up for meal with id ${paramMealId}`,
                  data: "",
                  datetime: new Date().toISOString(),
                });
              } else if (result) {
                participationDao.deleteParticipation(
                  paramMealId,
                  reqUserId,
                  (err, result) => {
                    if (result.length === 0) {
                      res.status(404).send({
                        status: 404,
                        message: `User with id ${reqUserId} is not signed up for meal with id ${paramMealId}`,
                        data: "",
                        datetime: new Date().toISOString(),
                      });
                    } else if (result) {
                      res.status(200).send({
                        status: 200,
                        message: `User with id ${reqUserId} is signed off for meal with id ${paramMealId}`,
                        data: "",
                        datetime: new Date().toISOString(),
                      });
                    } else {
                      res.status(400).send({
                        status: 400,
                        message: `Couldn't sign off user with id ${reqUserId} for meal with id ${paramMealId}`,
                        data: "",
                        datetime: new Date().toISOString(),
                      });
                    }
                  }
                );
              } else {
                res.status(400).send({
                  status: 400,
                  message: `Couldn't sign off user with id ${reqUserId} for meal with id ${paramMealId}`,
                  data: "",
                  datetime: new Date().toISOString(),
                });
              }
            }
          );
        } else {
          res.status(400).send({
            status: 400,
            message: `Couldn't sign off user with id ${reqUserId} for meal with id ${paramMealId}`,
            data: "",
            datetime: new Date().toISOString(),
          });
        }
      });
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: `Couldn't sign off user with id ${reqUserId} for meal with id ${paramMealId}`,
        data: "",
        datetime: new Date().toISOString(),
      });
    }
  },
};

module.exports = praticipationController;
