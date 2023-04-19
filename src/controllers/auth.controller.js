const logger = require("../config").logger;
const authDao = require("../daos/auth.dao");
const assert = require("assert");
const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.TOKEN_SECRET;

const authController = {
  async validateLogin(req, res, next) {
    try {
      assert(
        typeof req.body.emailAdress === "string",
        "emailAdress must be a string."
      );
      assert(
        typeof req.body.password === "string",
        "password must be a string."
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

  async validateRegister(req, res, next) {
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
        typeof req.body.isActive === "number",
        "isActive must be a number."
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
    } catch (err) {
      res.status(406).json({
        errCode: 406,
        message: "Failed validation",
        error: err.toString(),
        datetime: new Date().toISOString(),
      });
    }
  },

  async login(req, res, next) {
    logger.trace("authController login called");
    try {
      await authDao.login(req.body, (err, result) => {
        if (err) {
          res.status(500).json({
            errCode: 500,
            message: "Internal server error",
            error: err.toString(),
            datetime: new Date().toISOString(),
          });
        } else if (result.rows.length === 0) {
          res.status(404).json({
            errCode: 404,
            message: "User not found",
            error: err.toString(),
            datetime: new Date().toISOString(),
          });
        } else {
          const user = result.rows[0];
          if (user.password === req.body.password) {
            const payload = {
              id: user.id,
            };

            const userInfo = {
              id: user.id,
              firstName: user.firstname,
              lastName: user.lastname,
              emailAdress: user.emailadress,
              phoneNumber: user.phonenumber,
              roles: user.roles,
              isActive: user.isactive,
              street: user.street,
              city: user.city,
              token: jwt.sign(payload, jwtSecretKey, { expiresIn: "2h" }),
            };
            res.status(200).json({
              errCode: 200,
              message: "Login successful",
              user: userInfo,
              datetime: new Date().toISOString(),
            });
          } else {
            res.status(401).json({
              errCode: 401,
              message: "Wrong password",
              datetime: new Date().toISOString(),
            });
          }
        }
      });
    } catch (err) {
      res.status(500).json({
        errCode: 500,
        message: "Internal server error",
        error: err.toString(),
        datetime: new Date().toISOString(),
      });
    }
  },
  async register(req, res, next) {
    logger.trace("authController register called");
    try {
      await authDao.register(req.body, (err, result) => {
        if (err) {
          res.status(500).json({
            errCode: 500,
            message: "Internal server error",
            error: err.toString(),
            datetime: new Date().toISOString(),
          });
        } else {
          res.status(200).json({
            errCode: 200,
            message: "User created",
            datetime: new Date().toISOString(),
          });
        }
      });
    } catch (err) {
      res.status(500).json({
        errCode: 500,
        message: "Internal server error",
        error: err.toString(),
        datetime: new Date().toISOString(),
      });
    }
  },

    async validateToken(req, res, next) {
    logger.trace("authController validateToken called");
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      logger.warn("Authorization header missing!");
      res.status(401).json({
        error: "Authorization header missing!",
        datetime: new Date().toISOString()
      });
    } else {
      const token = authHeader.substring(7, authHeader.length);

      jwt.verify(token, jwtSecretKey, (err, payload) => {
        if (err) {
          logger.warn("Not authorized");
          res.status(401).json({
            error: "Not authorized",
            datetime: new Date().toISOString()
          });
        }
        if (payload) {
          logger.debug("token is valid", payload);
          req.UserID = payload.id;
          next();
        }
      });
    }
    },

    async renewToken(req, res, next) {
    logger.trace("authController renewToken called");
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        logger.warn("Authorization header missing!");
        res.status(401).json({
            error: "Authorization header missing!",
            datetime: new Date().toISOString()
        });
        }
        else {
            const token = authHeader.substring(7, authHeader.length);
            jwt.verify(token, jwtSecretKey, (err, payload) => {
                if (err) {
                    logger.warn("Not authorized");
                    res.status(401).json({
                        error: "Not authorized",
                        datetime: new Date().toISOString()
                    });
                }
                if (payload) {
                    logger.debug("token is valid", payload);
                    const newPayload = {
                        id: payload.id
                    };
                    const newToken = jwt.sign(newPayload, jwtSecretKey, { expiresIn: "2h" });
                    res.status(200).json({
                        token: newToken,
                        datetime: new Date().toISOString()
                    });
                }
            });
        }
    },
};

module.exports = authController;