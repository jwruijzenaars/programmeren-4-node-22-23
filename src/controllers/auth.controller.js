const logger = require("../config").logger;
const authDao = require("../daos/auth.dao");
const userDao = require("../daos/user.dao");
const assert = require("assert");
const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.TOKEN_SECRET;

const emailRegEx = new RegExp(
  "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
);
const passwordRegEx = new RegExp("[a-zA-Z0-9!#-'*]{4,}");
const phoneRegEx = new RegExp("[0-9]{10}");
const authController = {
  async validateLogin(req, res, next) {
    try {
      assert(
        typeof req.body.emailAdress === "string",
        "emailAdress must be a string."
      );
      assert(emailRegEx.test(req.body.emailAdress), "email is invalid.");
      assert(
        typeof req.body.password === "string",
        "password must be a string."
      );
      assert(
        passwordRegEx.test(req.body.password), "password is invalid, must be at least 4 characters long."
      );
      next();
    } catch (err) {
      res.status(400).json({
        status: 400,
        message: "Failed validation",
        data: "",
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
      assert(emailRegEx.test(req.body.emailAdress), "email is invalid.");
      assert(
        typeof req.body.emailAdress === "string",
        "emailAdress must be a string."
      );
      assert(
        passwordRegEx.test(req.body.password),
        "password is invalid, must be at least 4 characters long."
      );
      assert(
        typeof req.body.password === "string",
        "password must be a string."
      );
      assert(
        typeof req.body.phoneNumber === "string",
        "phoneNumber must be a string."
      );
      assert(passwordRegEx.test(req.body.phoneNumber), "phone is invalid.");
      assert(typeof req.body.roles === "string", "roles must be a string.");
      assert(typeof req.body.street === "string", "street must be a string.");
      assert(typeof req.body.city === "string", "city must be a string.");
      next();
    } catch (err) {
      res.status(400).json({
        status: 400,
        message: "Failed validation",
        data: "",
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
            status: 500,
            message: "Internal server error",
            data: "",
            datetime: new Date().toISOString(),
          });
        } else if (result.length === 0) {
          res.status(404).json({
            status: 404,
            message: "User not found",
            data: "",
            datetime: new Date().toISOString(),
          });
        } else {
          const user = result[0];
          if (user.password === req.body.password) {
            const payload = {
              id: user.id,
            };

            const userInfo = {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              emailAdress: user.emailAdress,
              phoneNumber: user.phoneNumber,
              roles: user.roles,
              isActive: user.isActive,
              street: user.street,
              city: user.city,
              token: jwt.sign(payload, jwtSecretKey, { expiresIn: "2h" }),
            };
            res.status(200).json({
              status: 200,
              message: "Login successful",
              data: userInfo,
              datetime: new Date().toISOString(),
            });
          } else {
            res.status(400).json({
              status: 400,
              message: "Wrong password or email combination",
              data: "",
              datetime: new Date().toISOString(),
            });
          }
        }
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        message: "Internal server error",
        data: "",
        datetime: new Date().toISOString(),
      });
    }
  },
  async register(req, res, next) {
    logger.trace("authController register called");
    try {
      if(req.body.isActive === undefined) {
        req.body.isActive = 0;
      }
      await authDao.register(req.body, (err, result) => {
        if (err) {
          if (err.includes("ER_DUP_ENTRY") || err.includes("Duplicate entry")) {
            res.status(403).json({
              status: 403,
              message: "Email is already in use",
              data: "",
              datetime: new Date().toISOString(),
            });
          } else {
            res.status(500).json({
              status: 500,
              message: "Internal server error",
              data: "",
              datetime: new Date().toISOString(),
            });
          }
        } else {
          userDao.getOne(result.insertId,  (err, result) => {
            if (err) {
              res.status(500).json({
                status: 500,
                message: "Internal server error",
                data: "",
                datetime: new Date().toISOString(),
              });
            } else {
              const user = result[0];
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
                isActive: user.isactive || 1,
                street: user.street,
                city: user.city,
                token: jwt.sign(payload, jwtSecretKey, { expiresIn: "2h" }),
              };
              res.status(200).json({
                status: 200,
                message: "User created",
                data: userInfo,
                datetime: new Date().toISOString(),
              });
            }
          });
        }
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        message: "Internal server error",
        data: "",
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
        status: 401,
        message: "Authorization header missing!",
        data: "",
        datetime: new Date().toISOString(),
      });
    } else {
      const token = authHeader.substring(7, authHeader.length);

      jwt.verify(token, jwtSecretKey, (err, payload) => {
        if (err) {
          logger.warn("Not authorized");
          res.status(401).json({
            status: 401,
            message: "Not authorized",
            data: "",
            datetime: new Date().toISOString(),
          });
        }
        if (payload) {
          logger.debug("token is valid", payload);
          req.userId = payload.id;
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
        status: 401,
        message: "Authorization header missing!",
        data: "",
        datetime: new Date().toISOString(),
      });
    } else {
      const token = authHeader.substring(7, authHeader.length);
      let payload = null;
      jwt.verify(token, jwtSecretKey, (err, payload) => {
        if (err) {
          logger.warn("Not authorized");
          res.status(401).json({
            status: 401,
            message: "Not authorized",
            data: "",
            datetime: new Date().toISOString(),
          });
        }
        if (payload) {
          payload = payload;
          logger.debug("token is valid", payload);
        }
      });
      await authDao.renewToken(payload.id, (err, result) => {
        if (err) {
          res.status(500).json({
            status: 500,
            message: "Internal server error",
            data: "",
            datetime: new Date().toISOString(),
          });
        } else {
          const user = result.rows[0];
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
            status: 200,
            message: "Token renewed",
            data: userInfo,
            datetime: new Date().toISOString(),
          });
        }
      });
    }
  },
};

module.exports = authController;
