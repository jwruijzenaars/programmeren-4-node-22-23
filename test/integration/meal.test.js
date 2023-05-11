const assert = require("assert");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../server");
const queries = require("../../src/daos/queries");
const logger = require("../../src/config").logger;
const jwt = require("jsonwebtoken");
const dbTestConfig = require("../../src/config").dbTestConfig;
const mysql = require("mysql2");
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

const expectedMeals = [
  {
    id: 1,
    isActive: 1,
    isVega: 0,
    isVegan: 0,
    isToTakeHome: 0,
    dateTime: "2020-01-01 00:00:00",
    maxAmountOfParticipants: 4,
    price: 10,
    imageUrl: "https://www.google.com/",
    cookId: 1,
    createDate: "2020-01-01 00:00:00",
    updateDate: "2020-01-01 00:00:00",
    name: "Test Meal",
    description: "Test Meal Description",
    allergenes: "gluten",
  },
  {
    id: 2,
    isActive: 1,
    isVega: 1,
    isVegan: 0,
    isToTakeHome: 1,
    dateTime: "2020-01-01 00:00:00",
    maxAmountOfParticipants: 6,
    price: 12,
    imageUrl: "https://www.google.com/",
    cookId: 1,
    createDate: "2020-01-01 00:00:00",
    updateDate: "2020-01-01 00:00:00",
    name: "Test Meal 2",
    description: "Test Meal Description 2",
    allergenes: "gluten",
  },
];

const expectedMeal = {
  id: 1,
  isActive: 1,
  isVega: 0,
  isVegan: 0,
  isToTakeHome: 0,
  dateTime: "2020-01-01 00:00:00",
  maxAmountOfParticipants: 4,
  price: 10,
  imageUrl: "https://www.google.com/",
  cookId: 1,
  createDate: "2020-01-01 00:00:00",
  updateDate: "2020-01-01 00:00:00",
  name: "Test Meal",
  description: "Test Meal Description",
  allergenes: "gluten",
};



const missingFieldMeal = {
  id: 1,
  isActive: 1,
  isVega: 0,
  isVegan: 0,
  dateTime: "2020-01-01 00:00:00",
  maxAmountOfParticipants: 4,
  price: 10,
  imageUrl: "https://www.google.com/",
  cookId: 1,
  createDate: "2020-01-01 00:00:00",
  updateDate: "2020-01-01 00:00:00",
  name: "Test Meal",
  description: "Test Meal Description",
  allergenes: "gluten",
};

const missingFieldsMeal = {
  id: 1,
  isActive: 1,
  isVega: 0,
  isVegan: 0,
  isToTakeHome: 0,
  dateTime: "2020-01-01 00:00:00",
  imageUrl: "https://www.google.com/",
  cookId: 1,
  createDate: "2020-01-01 00:00:00",
  updateDate: "2020-01-01 00:00:00",
  description: "Test Meal Description",
  allergenes: "gluten",
};

describe("meal tests", () => {
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
  describe("TC-301 create meal", () => {
    it("TC-301-1 shouldn't create a meal, missing field isToTakeHome", (done) => {
      chai
        .request(server)
        .post("/api/user")
        .send(expectedUser)
        .end((err, res) => {
          const token = res.body.data.token;
          chai
            .request(server)
            .post("/api/meal/")
            .send(missingFieldMeal)
            .auth(token, { type: "bearer" })
            .end((err, res) => {
              res.should.have.status(400);
              res.body.should.be.a("object");
              res.body.should.have.property("message");
              res.body.message.should.be.eql("Failed validation");
              res.body.should.have
                .property("error")
                .eq(
                  "AssertionError [ERR_ASSERTION]: isToTakeHome must be a number."
                );
              done();
            });
        });
    });

    it("TC-301-2 shouldn't create a meal, not logged in(Authorization header missing)", (done) => {
      chai
        .request(server)
        .post("/api/meal/")
        .send(expectedMeal)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a("object");
          res.body.should.have.property("status").eq(401);
          res.body.should.have.property("message");
          res.body.message.should.be.eql("Authorization header missing!");
          done();
        });
    });

    it("TC-301-3 should create a meal", (done) => {
      chai
        .request(server)
        .post("/api/user")
        .send(expectedUser)
        .end((err, res) => {
          const userId = res.body.data.id;
          const token = res.body.data.token;
          chai
            .request(server)
            .post("/api/meal/")
            .send(expectedMeal)
            .auth(token, { type: "bearer" })
            .end((err, res) => {
              res.should.have.status(201);
              res.body.should.be.a("object");
              res.body.should.have.property("status").eq(201);
              res.body.should.have.property("message").eq("Meal created");
              res.body.should.have.property("data");
              res.body.data.should.have
                .property("isActive")
                .eq(expectedMeal.isActive);
              res.body.data.should.have
                .property("isVega")
                .eq(expectedMeal.isVega);
              res.body.data.should.have
                .property("isVegan")
                .eq(expectedMeal.isVegan);
              res.body.data.should.have
                .property("isToTakeHome")
                .eq(expectedMeal.isToTakeHome);
              res.body.data.should.have.property("dateTime");
              Date(res.body.data.dateTime).should.be.eql(
                Date(expectedMeal.dateTime)
              );
              res.body.data.should.have
                .property("maxAmountOfParticipants")
                .eq(expectedMeal.maxAmountOfParticipants);
              res.body.data.should.have
                .property("price")
                .eq('10.00');
              res.body.data.should.have
                .property("imageUrl")
                .eq(expectedMeal.imageUrl);
              res.body.data.should.have.property("cookId").eq(userId);
              res.body.data.should.have.property("createDate");
              Date(res.body.data.createDate).should.be.eql(
                Date(expectedMeal.createDate)
              );
              res.body.data.should.have.property("updateDate");
              Date(res.body.data.updateDate).should.be.eql(
                Date(expectedMeal.updateDate)
              );
              res.body.data.should.have.property("name").eq(expectedMeal.name);
              res.body.data.should.have
                .property("description")
                .eq(expectedMeal.description);
              res.body.data.should.have
                .property("allergenes")
                .eq(expectedMeal.allergenes);
              done();
            });
        });
    });
  });
  describe("TC-302 update meal", () => {
    it("TC-302-1 shouldn't update a meal, missing fields name, price and maxAmountOfParticipants", (done) => {
      chai
        .request(server)
        .post("/api/user")
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
                .put("/api/meal/" + mealId)
                .send(missingFieldsMeal)
                .auth(token, { type: "bearer" })
                .end((err, res) => {
                  res.should.have.status(400);
                  res.body.should.be.a("object");
                  res.body.should.have.property("status").eq(400);
                  res.body.should.have
                    .property("message")
                    .eq("Failed validation");
                  res.body.should.have
                    .property("error")
                    .eq(
                      "AssertionError [ERR_ASSERTION]: maxAmountOfParticipants must be a number."
                    );
                  done();
                });
            });
        });
    });

    it("TC-302-2 shouldn't update a meal, not logged in(Authorization header missing)", (done) => {
      chai
        .request(server)
        .post("/api/user")
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
                .put("/api/meal/" + mealId)
                .send(expectedMeal)
                .end((err, res) => {
                  logger.debug(res.body);
                  res.should.have.status(401);
                  res.body.should.be.a("object");
                  res.body.should.have.property("status").eq(401);
                  res.body.should.have
                    .property("message")
                    .eq("Authorization header missing!");
                  res.body.should.not.have.property("data");
                  done();
                });
            });
        });
    });

    it("TC-302-3 shouldn't update a meal, not the owner of data", (done) => {
      chai
        .request(server)
        .post("/api/user")
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
                .post("/api/user")
                .send(expectedUser1)
                .end((err, res) => {
                  const token2 = res.body.data.token;
                  chai
                    .request(server)
                    .put("/api/meal/" + mealId)
                    .send(expectedMeal)
                    .auth(token2, { type: "bearer" })
                    .end((err, res) => {
                      res.should.have.status(403);
                      res.body.should.be.a("object");
                      res.body.should.have.property("status").eq(403);
                      res.body.should.have
                        .property("message")
                        .eq(
                          "Not authorized to update a meal that isn't yours."
                        );
                      res.body.should.not.have.property("data");
                      done();
                    });
                });
            });
        });
    });

    it("TC-302-4 shouldn't update a meal, meal doesn't exist", (done) => {
      chai
        .request(server)
        .post("/api/user")
        .send(expectedUser)
        .end((err, res) => {
          const token = res.body.data.token;
          chai
            .request(server)
            .put("/api/meal/" + 1)
            .send(expectedMeal)
            .auth(token, { type: "bearer" })
            .end((err, res) => {
              res.should.have.status(403);
              res.body.should.be.a("object");
              res.body.should.have.property("status").eq(403);
              res.body.should.have
                .property("message")
                .eq("Not authorized to update a meal that isn't yours.");
              res.body.should.not.have.property("data");
              done();
            });
        });
    });

    it("TC-302-5 should update a meal", (done) => {
      chai
        .request(server)
        .post("/api/user")
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
              const updatedMeal = {
                id: 1,
                isActive: 1,
                isVega: 0,
                isVegan: 0,
                isToTakeHome: 1,
                dateTime: "2020-01-01 00:00:00",
                maxAmountOfParticipants: 5,
                price: 15,
                imageUrl: "https://www.google.com/",
                cookId: userId,
                createDate: "2020-01-01 00:00:00",
                updateDate: "2020-01-01 00:00:00",
                name: "Test Meal",
                description: "Test Meal Description",
                allergenes: "gluten,lactose",
              };
              chai
                .request(server)
                .put("/api/meal/" + mealId)
                .send(updatedMeal)
                .auth(token, { type: "bearer" })
                .end((err, res) => {
                  logger.debug(res.body)
                  res.should.have.status(200);
                  res.body.should.be.a("object");
                  res.body.should.have.property("status").eq(200);
                  res.body.should.have.property("message").eq("Meal updated");
                  res.body.should.have.property("data");
                  res.body.data.should.have.property("id").eq(mealId);
                  res.body.data.should.have
                    .property("name")
                    .eq(updatedMeal.name);
                  res.body.data.should.have
                    .property("price")
                    .eq('15.00');
                  res.body.data.should.have
                    .property("maxAmountOfParticipants")
                    .eq(updatedMeal.maxAmountOfParticipants);
                  res.body.data.should.have
                    .property("description")
                    .eq(updatedMeal.description);
                  res.body.data.should.have
                    .property("allergenes")
                    .eq(updatedMeal.allergenes);
                  res.body.data.should.have
                    .property("isActive")
                    .eq(updatedMeal.isActive);
                  res.body.data.should.have
                    .property("isVega")
                    .eq(updatedMeal.isVega);
                  res.body.data.should.have
                    .property("isVegan")
                    .eq(updatedMeal.isVegan);
                  res.body.data.should.have
                    .property("isToTakeHome")
                    .eq(updatedMeal.isToTakeHome);
                  res.body.data.should.have
                    .property("cookId")
                    .eq(userId);
                  res.body.data.should.have
                    .property("createDate");
                  Date(res.body.data.createDate).should.be.eql(Date(updatedMeal.createDate));
                  res.body.data.should.have
                    .property("updateDate");
                  Date(res.body.data.updateDate).should.be.eql(Date(updatedMeal.updateDate));
                  res.body.data.should.have
                    .property("dateTime");
                  Date(res.body.data.dateTime).should.be.eql(Date(updatedMeal.dateTime));
                  done();
                });
            });
        });
    });
  });
  describe("TC-303 get all meals", () => {
    it("TC-303-1 should return all meals", (done) => {
      chai
        .request(server)
        .post("/api/user")
        .send(expectedUser)
        .end((err, res) => {
          const token = res.body.data.token;
          chai
            .request(server)
            .post("/api/meal/")
            .send(expectedMeals[0])
            .auth(token, { type: "bearer" })
            .end((err, res) => {
              chai
                .request(server)
                .post("/api/meal/")
                .send(expectedMeals[1])
                .auth(token, { type: "bearer" })
                .end((err, res) => {
                  chai
                    .request(server)
                    .get("/api/meal")
                    .end((err, res) => {
                      res.should.have.status(200);
                      res.body.should.have.property("data");
                      res.body.data.should.be.a("array");
                      res.body.data.length.should.be.eq(expectedMeals.length);
                      for (let i = 0; i < res.body.length; i++) {
                        assert.deepStrictEqual(
                          res.body.data[i].isActive,
                          expectedMeals[i].isActive
                        );
                        assert.deepStrictEqual(
                          res.body.data[i].isVega,
                          expectedMeals[i].isVega
                        );
                        assert.deepStrictEqual(
                          res.body.data[i].isVegan,
                          expectedMeals[i].isVegan
                        );
                        assert.deepStrictEqual(
                          res.body.data[i].isToTakeHome,
                          expectedMeals[i].isToTakeHome
                        );
                        assert.deepStrictEqual(
                          res.body.data[i].dateTime,
                          expectedMeals[i].dateTime
                        );
                        assert.deepStrictEqual(
                          res.body.data[i].maxAmountOfParticipants,
                          expectedMeals[i].maxAmountOfParticipants
                        );
                        assert.deepStrictEqual(
                          res.body.data[i].price,
                          expectedMeals[i].price
                        );
                        assert.deepStrictEqual(
                          res.body.data[i].imageUrl,
                          expectedMeals[i].imageUrl
                        );
                        assert.deepStrictEqual(
                          res.body.data[i].cookId,
                          expectedMeals[i].cookId
                        );
                        assert.deepStrictEqual(
                          res.body.data[i].createDate,
                          expectedMeals[i].createDate
                        );
                        assert.deepStrictEqual(
                          res.body.data[i].updateDate,
                          expectedMeals[i].updateDate
                        );
                        assert.deepStrictEqual(
                          res.body.data[i].name,
                          expectedMeals[i].name
                        );
                        assert.deepStrictEqual(
                          res.body.data[i].description,
                          expectedMeals[i].description
                        );
                        assert.deepStrictEqual(
                          res.body.data[i].allergenes,
                          expectedMeals[i].allergenes
                        );
                      }
                      done();
                    });
                });
            });
        });
    });
    
  });
});
