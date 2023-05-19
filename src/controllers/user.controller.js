const assert = require("assert");
const userDao = require("../daos/user.dao");
const utils = require("../utils");
const logger = require("../config").logger;

const emailRegEx = new RegExp(
  "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
);
const passwordRegEx = new RegExp("[a-zA-Z0-9!#-'*]{3,}");
const phoneRegEx = new RegExp("[0-9]{10}");
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
        typeof req.body.isActive === "number",
        "isActive must be a number."
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
      assert(phoneRegEx.test(req.body.phoneNumber), "phoneNumber is invalid.");
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

  // async getFiltered(req, res, next) {
  //   logger.trace("userController getFiltered called");
  //   try {
  //     if (req.params.city && req.params.roles) {
  //       await userDao.getByCityAndRoles(
  //         req.params.city,
  //         req.params.roles,
  //         (err, result) => {
  //           if (result.length === 0) {
  //             res.status(404).send({
  //               status: 404,
  //               message: `No users found`,
  //               datetime: new Date().toISOString(),
  //             });
  //           }
  //           if (result) {
  //             res.status(200).send({
  //               status: 200,
  //               message: `Got all users filtered by city and roles`,
  //               resultCount: result.length,
  //               data: result,
  //             });
  //           } else {
  //             res.status(400).send({
  //               status: 400,
  //               message: `Couldn't get users`,
  //               datetime: new Date().toISOString(),
  //             });
  //           }
  //         }
  //       );
  //     } else if (req.params.city) {
  //       await userDao.getByCity(req.params.city, (err, result) => {
  //         if (result.length === 0) {
  //           res.status(404).send({
  //             status: 404,
  //             message: `No users found`,
  //             datetime: new Date().toISOString(),
  //           });
  //         }
  //         if (result) {
  //           res.status(200).send({
  //             status: 200,
  //             message: `Got all users filtered by city`,
  //             resultCount: result.length,
  //             data: result,
  //           });
  //         } else {
  //           res.status(400).send({
  //             status: 400,
  //             message: `Couldn't get users`,
  //             datetime: new Date().toISOString(),
  //           });
  //         }
  //       });
  //     } else if (req.params.roles) {
  //       await userDao.getByRoles(req.params.roles, (err, result) => {
  //         if (result.length === 0) {
  //           res.status(404).send({
  //             status: 404,
  //             message: `No users found`,
  //             datetime: new Date().toISOString(),
  //           });
  //         }
  //         if (result) {
  //           res.status(200).send({
  //             status: 200,
  //             message: `Got all users filtered by roles`,
  //             resultCount: result.length,
  //             data: result,
  //           });
  //         } else {
  //           res.status(400).send({
  //             status: 400,
  //             message: `Couldn't get users`,
  //             datetime: new Date().toISOString(),
  //           });
  //         }
  //       });
  //     } else {
  //       await this.getall(req, res, next);
  //     }
  //   } catch (err) {
  //     res.status(400).send({
  //       status: 400,
  //       message: `Couldn't get users`,
  //       datetime: new Date().toISOString(),
  //     });
  //   }
  // },

  async getAll(req, res, next) {
    logger.trace("userController getAll called");
    try {
      const city = req.query.city;
      const roles = req.query.roles;
      if (city && roles) {
        await userDao.getByCityAndRoles(city, roles, (err, result) => {
          if (result) {
            if (result.length === 0) {
              res.status(404).send({
                status: 404,
                message: `No users found`,
                data: "",
                datetime: new Date().toISOString(),
              });
            } else {
              res.status(200).send({
                status: 200,
                message: `Got all users filtered by city and roles`,
                resultCount: result.length,
                data: result,
              });
            }
          } else {
            res.status(400).send({
              status: 400,
              message: `Couldn't get users`,
              data: "",
              datetime: new Date().toISOString(),
            });
          }
        });
      } else if (city) {
        await userDao.getByCity(city, (err, result) => {
          if (result) {
            if (result.length === 0) {
              res.status(404).send({
                status: 404,
                message: `No users found`,
                data: "",
                datetime: new Date().toISOString(),
              });
            } else {
              res.status(200).send({
                status: 200,
                message: `Got all users filtered by city`,
                resultCount: result.length,
                data: result,
              });
            }
          } else {
            res.status(400).send({
              status: 400,
              message: `Couldn't get users`,
              data: "",
              datetime: new Date().toISOString(),
            });
          }
        });
      } else if (roles) {
        await userDao.getByRoles(roles, (err, result) => {
          if (result) {
            if (result.length === 0) {
              res.status(404).send({
                status: 404,
                message: `No users found`,
                data: "",
                datetime: new Date().toISOString(),
              });
            } else {
              res.status(200).send({
                status: 200,
                message: `Got all users filtered by roles`,
                resultCount: result.length,
                data: result,
              });
            }
          } else {
            res.status(400).send({
              status: 400,
              message: `Couldn't get users`,
              data: "",
              datetime: new Date().toISOString(),
            });
          }
        });
      } else {
        await userDao.getAll((err, result) => {
          if (result) {
            if (result.length === 0) {
              res.status(404).send({
                status: 404,
                message: `No users found`,
                data: "",
                datetime: new Date().toISOString(),
              });
            } else {
              res.status(200).send({
                status: 200,
                message: `Got all users`,
                resultCount: result.length,
                data: result,
              });
            }
          } else {
            res.status(400).send({
              status: 400,
              message: `Couldn't get users`,
              data: "",
              datetime: new Date().toISOString(),
            });
          }
        });
      }
    } catch (err) {
      res.status(400).send({
        status: 400,
        message: `Couldn't get users`,
        data: "",
        datetime: new Date().toISOString(),
      });
    }
  },

  async getOne(req, res, next) {
    logger.trace("userController getOne called");
    try {
      if (req.userId === req.params.userId) {
        await this.getOwn(req, res, next);
      } else {
        await userDao.getOne(req.params.userId, (err, result) => {
          if (result.length === 0) {
            res.status(404).send({
              status: 404,
              message: `User with Id ${req.params.userId} not found`,
              data: "",
              datetime: new Date().toISOString(),
            });
          } else if (result) {
            res.status(200).send({
              status: 200,
              message: `Got user with Id ${req.params.userId}`,
              data: result[0],
            });
          } else {
            res.status(400).send({
              status: 400,
              message: `Couldn't get user with Id ${req.params.userId}`,
              data: "",
              datetime: new Date().toISOString(),
            });
          }
        });
      }
    } catch (err) {
      res.status(400).send({
        status: 400,
        message: `Couldn't get user with Id ${req.params.userId}`,
        data: "",
        datetime: new Date().toISOString(),
      });
    }
  },

  async getOwn(req, res, next) {
    logger.trace("userController getOwn called");
    try {
      if (req.userId) {
        await userDao.getOwn(req.userId, (err, result) => {
          if (result.length === 0) {
            res.status(404).send({
              status: 404,
              message: `User with Id ${req.params.userId} not found`,
              data: "",
              datetime: new Date().toISOString(),
            });
          } else if (result) {
            res.status(200).send({
              status: 200,
              message: `Got user with Id ${req.userId}`,
              data: result[0],
            });
          } else {
            res.status(400).send({
              status: 400,
              message: `Couldn't get user with Id ${req.userId}`,
              data: "",
              datetime: new Date().toISOString(),
            });
          }
        });
      } else {
        res.status(401).send({
          status: 401,
          message: "Not authorized, you may need to login again",
          data: "",
          datetime: new Date().toISOString(),
        });
      }
    } catch (err) {
      res.status(400).send({
        status: 400,
        message: `Couldn't get user with Id ${req.params.userId}`,
        data: "",
        datetime: new Date().toISOString(),
      });
    }
  },

  async update(req, res, next) {
    logger.trace("userController update called");
    try {
      const userIdParam = req.params.userId;
      const userIdToken = req.userId;
      const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        isActive: req.body.isActive,
        emailAdress: req.body.emailAdress,
        password: req.body.password,
        phoneNumber: req.body.phoneNumber,
        roles: req.body.roles,
        street: req.body.street,
        city: req.body.city,
      };
      if (userIdToken === Number(userIdParam)) {
        await userDao.update(userIdParam, user, (err, result) => {
          if (result.length === 0) {
            res.status(404).send({
              status: 404,
              message: `User with Id ${userIdToken} not found`,
              data: "",
              datetime: new Date().toISOString(),
            });
          } else if (result) {
            userDao.getOne(userIdToken, (err, resultOne) => {
              if (err) {
                res.status(500).json({
                  status: 500,
                  message: "Internal server error",
                  data: "",
                  datetime: new Date().toISOString(),
                });
              } else {
                const user = resultOne[0];
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
                };
                res.status(200).send({
                  status: 200,
                  message: `Updated user with Id ${req.params.userId}`,
                  data: userInfo,
                });
              }
            });
          } else {
            res.status(400).send({
              status: 400,
              message: `Couldn't update user with Id ${req.params.userId}`,
              data: "",
              datetime: new Date().toISOString(),
            });
          }
        });
      } else {
        res.status(403).send({
          status: 403,
          message: "Not authorized to update another user",
          data: "",
          datetime: new Date().toISOString(),
        });
      }
    } catch (err) {
      res.status(400).send({
        status: 400,
        message: `Couldn't update user with Id ${req.params.userId}`,
        data: "",
        datetime: new Date().toISOString(),
      });
    }
  },

  async delete(req, res, next) {
    logger.trace("userController delete called");
    try {
      if (req.userId === Number(req.params.userId)) {
        await userDao.delete(req.params.userId, (err, result) => {
          if (result.affectedRows === 0) {
            res.status(404).send({
              status: 404,
              message: `Couldn't find user with Id ${req.params.userId} to delete`,
              data: "",
              datetime: new Date().toISOString(),
            });
          } else {
            res.status(200).send({
              status: 200,
              message: `User with Id ${req.params.userId} is deleted`,
              data: "",
              datetime: new Date().toISOString(),
            });
          }
        });
      } else {
        res.status(401).send({
          status: 401,
          message: "Not authorized to delete another user",
          data: "",
          datetime: new Date().toISOString(),
        });
      }
    } catch (err) {
      res.status(400).send({
        status: 400,
        message: `Couldn't delete user with Id ${req.params.userId}`,
        data: "",
        datetime: new Date().toISOString(),
      });
    }
  },
};

module.exports = userController;
