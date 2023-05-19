const assert = require("assert");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../server");
const queries = require("../../src/daos/queries");
const logger = require("../../src/config").logger;
const jwt = require("jsonwebtoken");
const dbTestConfig = require("../../src/config").dbTestConfig;
const mysql = require("mysql2");
const { jwtSecretKey } = require("../../src/config");
const pool = mysql.createPool(dbTestConfig);
logger.trace("Connected to database: " + dbTestConfig.database);

chai.should();
chai.use(chaiHttp);

const expectedUser = {
  id: 1,
  firstName: "Jan Willem",
  lastName: "Ruijzenaars",
  isActive: 1,
  emailAdress: "meal.test@student.avans.nl",
  password: "secret",
  phoneNumber: "06 12425475",
  roles: "editor,guest",
  street: "Lovensdijkstraat",
  city: "Breda",
};

const expectedUser1 = {
  id: 1,
  firstName: "Jan Willem",
  lastName: "Ruijzenaars",
  isActive: 1,
  emailAdress: "meal.testseconduser@student.avans.nl",
  password: "secret",
  phoneNumber: "06 12425475",
  roles: "editor,guest",
  street: "Lovensdijkstraat",
  city: "Breda",
};

const expectedMeal = {
  id: 1,
  isActive: 1,
  isVega: 0,
  isVegan: 0,
  isToTakeHome: 0,
  dateTime: "2020-01-01 00:00:00",
  maxAmountOfParticipants: 1,
  price: 10,
  imageUrl: "https://www.google.com/",
  cookId: 1,
  createDate: "2020-01-01 00:00:00",
  updateDate: "2020-01-01 00:00:00",
  name: "Test Meal",
  description: "Test Meal Description",
  allergenes: "gluten",
};

describe("participation tests", () => {
  beforeEach((done) => {
    beforeEach((done) => {
      pool.query(queries.CLEAR_DB_PARTICIPATION, (err, res) => {
        if (err) {
          done(err);
        }
        done();
      });
    });
    pool.query(queries.CLEAR_DB_MEAL, (err, res) => {
      if (err) {
        console.log(err);
        done(err);
      }
      done();
    });
  });
  beforeEach((done) => {
    pool.query(queries.CLEAR_DB_USER, (err, res) => {
      if (err) {
        done(err);
      }
      done();
    });
  });

  afterEach((done) => {
    afterEach((done) => {
      pool.query(queries.CLEAR_DB_PARTICIPATION, (err, res) => {
        if (err) {
          done(err);
        }
        done();
      });
    });
    pool.query(queries.CLEAR_DB_MEAL, (err, res) => {
      if (err) {
        console.log(err);
        done(err);
      }
      done();
    });
  });
  afterEach((done) => {
    pool.query(queries.CLEAR_DB_USER, (err, res) => {
      if (err) {
        done(err);
      }
      done();
    });
  });

  describe("UC 401, sign up for a meal", () => {
    it("TC-401-1, shouldn't sign up for a meal, not logged in", (done) => {
      chai
        .request(server)
        .post("/api/user/")
        .send(expectedUser)
        .end((err, res) => {
          const token = res.body.data.token;
          chai
            .request(server)
            .post("/api/meal/")
            .send(expectedMeal)
            .auth(token, { type: "bearer" })
            .end((err, res) => {
              const mealId = res.body.data.id;
              chai
                .request(server)
                .post("/api/meal/" + mealId + "/participate")
                .end((err, res) => {
                  res.should.have.status(401);
                  res.body.should.have
                    .property("message")
                    .eql("Authorization header missing!");
                  res.body.should.have.property("data").eql("");
                  done();
                });
            });
        });
    });

    it("TC-401-2, shouldn't sign up for a meal, meal doesn't exist", (done) => {
      chai
        .request(server)
        .post("/api/user/")
        .send(expectedUser)
        .end((err, res) => {
          const token = res.body.data.token;
          chai
            .request(server)
            .post("/api/meal/1/participate")
            .auth(token, { type: "bearer" })
            .end((err, res) => {
              res.body.should.have
                .property("message")
                .eql(`Meal with id 1 not found`);
              res.should.have.status(404);
              res.body.should.have.property("status").eql(404);
              res.body.should.have.property("data").eql("");
              done();
            });
        });
    });

    it("TC-401-3, should sign up for a meal", (done) => {
      chai
        .request(server)
        .post("/api/user/")
        .send(expectedUser)
        .end((err, res) => {
          const token = res.body.data.token;
          const userId = res.body.data.id;
          chai
            .request(server)
            .post("/api/meal/")
            .send(expectedMeal)
            .auth(token, { type: "bearer" })
            .end((err, res) => {
              const mealId = res.body.data.id;
              chai
                .request(server)
                .post("/api/meal/" + mealId + "/participate")
                .auth(token, { type: "bearer" })
                .end((err, res) => {
                  res.body.should.have
                    .property("message")
                    .eql(
                      `User with id ${userId} is signed up for meal with id ${mealId}`
                    );
                  res.should.have.status(200);
                  res.body.should.have.property("status").eql(200);
                  res.body.should.have.property("data").eq("");
                  done();
                });
            });
        });
    });

    it("TC-401-4, shouldn't sign up for a meal, meal is full", (done) => {
      chai
        .request(server)
        .post("/api/user/")
        .send(expectedUser)
        .end((err, res) => {
          const token = res.body.data.token;
          const userId = res.body.data.id;
          chai
            .request(server)
            .post("/api/user/")
            .send(expectedUser1)
            .end((err, res) => {
              const token1 = res.body.data.token;
              const userId1 = res.body.data.id;
              chai
                .request(server)
                .post("/api/meal/")
                .send(expectedMeal)
                .auth(token, { type: "bearer" })
                .end((err, res) => {
                  const mealId = res.body.data.id;
                  chai
                    .request(server)
                    .post("/api/meal/" + mealId + "/participate")
                    .auth(token, { type: "bearer" })
                    .end((err, res) => {
                      res.body.should.have
                        .property("message")
                        .eql(
                          `User with id ${userId} is signed up for meal with id ${mealId}`
                        );
                      res.should.have.status(200);
                      res.body.should.have.property("status").eql(200);
                      res.body.should.have.property("data").eq("");
                      chai
                        .request(server)
                        .post("/api/meal/" + mealId + "/participate")
                        .auth(token1, { type: "bearer" })
                        .end((err, res) => {
                          res.body.should.have
                            .property("message")
                            .eql(`Meal with id ${mealId} is already full`);
                          res.should.have.status(200);
                          res.body.should.have.property("status").eql(200);
                          res.body.should.have.property("data").eql("");
                          done();
                        });
                    });
                });
            });
        });
    });
  });

  describe("UC 402, sign off from a meal", () => {
    it("TC-402-1, shouldn't sign off from a meal, not logged in", (done) => {
      chai
        .request(server)
        .post("/api/user/")
        .send(expectedUser)
        .end((err, res) => {
          const token = res.body.data.token;
          chai
            .request(server)
            .post("/api/meal/")
            .send(expectedMeal)
            .auth(token, { type: "bearer" })
            .end((err, res) => {
              const mealId = res.body.data.id;
              chai
                .request(server)
                .post("/api/meal/" + mealId + "/participate")
                .auth(token, { type: "bearer" })
                .end((err, res) => {
                  chai
                    .request(server)
                    .delete("/api/meal/" + mealId + "/participate")
                    .end((err, res) => {
                      res.should.have.status(401);
                      res.body.should.have.property("status").eql(401);
                      res.body.should.have
                        .property("message")
                        .eql("Authorization header missing!");
                      res.body.should.have.property("data").eql("");
                      done();
                    });
                });
            });
        });
    });

    it("TC-402-2, shouldn't sign off from a meal, meal doesn't exist", (done) => {
      chai
        .request(server)
        .post("/api/user/")
        .send(expectedUser)
        .end((err, res) => {
          const token = res.body.data.token;
          chai
            .request(server)
            .delete("/api/meal/1/participate")
            .auth(token, { type: "bearer" })
            .end((err, res) => {
              res.body.should.have
                .property("message")
                .eql(`Meal with id 1 not found`);
              res.should.have.status(404);
              res.body.should.have.property("status").eql(404);
              res.body.should.have.property("data").eql("");
              done();
            });
        });
    });

    it("TC-402-3, shouldn't sign off from a meal, participation doesn't exist", (done) => {
      chai
        .request(server)
        .post("/api/user/")
        .send(expectedUser)
        .end((err, res) => {
          const token = res.body.data.token;
          const userId = res.body.data.id;
          chai
            .request(server)
            .post("/api/meal/")
            .send(expectedMeal)
            .auth(token, { type: "bearer" })
            .end((err, res) => {
              const mealId = res.body.data.id;
              chai
                .request(server)
                .delete("/api/meal/" + mealId + "/participate")
                .auth(token, { type: "bearer" })
                .end((err, res) => {
                  res.body.should.have
                    .property("message")
                    .eq(
                      `User with id ${userId} is not signed up for meal with id ${mealId}`
                    );
                  res.should.have.status(404);
                  res.body.should.have.property("status").eql(404);
                  res.body.should.have.property("data").eql("");
                  done();
                });
            });
        });
    });

    it("TC-402-4, should sign off from a meal", (done) => {
      chai
        .request(server)
        .post("/api/user/")
        .send(expectedUser)
        .end((err, res) => {
          const token = res.body.data.token;
          const userId = res.body.data.id;
          chai
            .request(server)
            .post("/api/meal/")
            .send(expectedMeal)
            .auth(token, { type: "bearer" })
            .end((err, res) => {
              const mealId = res.body.data.id;
              chai
                .request(server)
                .post("/api/meal/" + mealId + "/participate")
                .auth(token, { type: "bearer" })
                .end((err, res) => {
                  res.body.should.have
                    .property("message")
                    .eql(
                      `User with id ${userId} is signed up for meal with id ${mealId}`
                    );
                  res.should.have.status(200);
                  res.body.should.have.property("status").eql(200);
                  res.body.should.have.property("data").eq("");
                  chai
                    .request(server)
                    .delete("/api/meal/" + mealId + "/participate")
                    .auth(token, { type: "bearer" })
                    .end((err, res) => {
                      res.body.should.have
                        .property("message")
                        .eql(
                          `User with id ${userId} is signed off for meal with id ${mealId}`
                        );
                      res.should.have.status(200);
                      res.body.should.have.property("status").eql(200);
                      res.body.should.have.property("data").eql("");
                      done();
                    });
                });
            });
        });
    });
  });
});
