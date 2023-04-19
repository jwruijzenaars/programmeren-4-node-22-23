const assert = require("assert");
const userDao = require("../daos/user.dao");
const utils = require("../utils");
const logger = require("../config").logger;

const userController = {
  async validateUser(req, res, next) {
    try {
        assert(
            typeof req.body.firstName === "string",
            "firstName must be a string."
          );
          assert(
            typeof req.body.lastName === "string",
            "lastName must be a string."
          );
          assert(
            typeof req.body.emailAdress === "string",
            "emailAdress must be a string."
          );
          assert(
            typeof req.body.password === "string",
            "password must be a string."
          );
          assert(
            typeof req.body.phoneNumber === "string",
            "phoneNumber must be a string."
          );
          assert(typeof req.body.roles === "string", "roles must be a string.");
          assert(typeof req.body.street === "string", "street must be a string.");
          assert(typeof req.body.city === "string", "city must be a string.");
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

  async getAll(req, res, next) {
    logger.trace("userController getAll called");
    try {
      await userDao.getAll((err, result) => {
        utils.handleResult(res, next, err, result);
      });
    } catch (err) {
      utils.handleResult(res, next, err, null);
    }
  },

  async getOne(req, res, next) {
    logger.trace("userController getOne called");
    try {
      await userDao.getOne(req.params.id, (err, result) => {
        utils.handleResult(res, next, err, result);
      });
    } catch (err) {
      utils.handleResult(res, next, err, null);
    }
  },

  async getOwn(req, res, next) {
    logger.trace("userController getOwn called");
    try {
      await userDao.getOwn(req.params.id, (err, result) => {
        utils.handleResult(res, next, err, result);
      });
    } catch (err) {
      utils.handleResult(res, next, err, null);
    }
  },

  async update(req, res, next) {
    logger.trace("userController update called");
    try {
        const user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            isActive: req.body.isActive,
            emailAdress: req.body.emailAdress,
            password: req.body.password,
            phoneNumber: req.body.phoneNumber,
            roles: req.body.roles,
            street: req.body.street,
            city: req.body.city
        };
      await userDao.update(req.params.id, user, (err, result) => {
        utils.handleResult(res, next, err, result);
      });
    } catch (err) {
      utils.handleResult(res, next, err, null);
    }
  },

  async delete(req, res, next) {
    logger.trace("userController delete called");
    try {
      await userDao.delete(req.params.id, (err, result) => {
        utils.handleResult(res, next, err, result);
        });
    } catch (err) {
      utils.handleResult(res, next, err, null);
    }
  },
};

module.exports = userController;
