const assert = require("assert");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../server");
const queries = require("../../src/daos/queries");
const logger = require("../../src/config").logger;
const jwt = require("jsonwebtoken");
const pool = require("../../src/daos/database").pool;

chai.should();
chai.use(chaiHttp);

const expectedUsers = [
  {
    id: 1,
    firstName: "Jan Willem",
    lastName: "Ruijzenaars",
    isActive: 1,
    emailAdress: "jw.ruijzenaars@student.avans.nl",
    password: "secret",
    phoneNumber: "06 12425475",
    roles: "editor,guest",
    street: "Professor Cobbenhagenlaan",
    city: "Tilburg",
  },
  {
    id: 2,
    firstName: "Jan Willem",
    lastName: "Ruijzenaars",
    isActive: 1,
    emailAdress: "jw.ruijze@student.avans.nl",
    password: "secret",
    phoneNumber: "06 12425475",
    roles: "editor,guest",
    street: "Lovensdijkstraat",
    city: "Breda",
  },
];

const expectedUser = {
  id: 1,
  firstName: "Jan Willem",
  lastName: "Ruijzenaars",
  isActive: 1,
  emailAdress: "jw.ruijzenaars@student.avans.nl",
  password: "secret",
  phoneNumber: "06 12425475",
  roles: "editor,guest",
  street: "Lovensdijkstraat",
  city: "Breda",
};

const invalidEmailUser = {
  id: 1,
  firstName: "Jan Willem",
  lastName: "Ruijzenaars",
  isActive: 1,
  emailAdress: "jw.ruijzenaarsstudent.avans.nl",
  password: "secret",
  phoneNumber: "06 12425475",
  roles: "editor,guest",
  street: "Lovensdijkstraat",
  city: "Breda",
};

const invalidPasswordUser = {
  id: 1,
  firstName: "Jan Willem",
  lastName: "Ruijzenaars",
  isActive: 1,
  emailAdress: "jw.ruijzenaars@student.avans.nl",
  password: "sec",
  phoneNumber: "06 12425475",
  roles: "editor,guest",
  street: "Lovensdijkstraat",
  city: "Breda",
};

const missingFieldUser = {
  firstName: "Jan Willem",
  lastName: "Ruijzenaars",
  isActive: 1,
  emailAdress: "jw.ruijzenaars@student.avans.nl",
  password: "secret",
  roles: "editor,guest",
  street: "Lovensdijkstraat",
  city: "Breda",
};

const missingEmailUser = {
  id: 1,
  firstName: "Jan Willem",
  lastName: "Ruijzenaars",
  isActive: 1,
  password: "secret",
  phoneNumber: "06 12425475",
  roles: "editor,guest",
  street: "Lovensdijkstraat",
  city: "Breda",
};

const invalidPhoneNumberUser = {
  id: 1,
  firstName: "Jan Willem",
  lastName: "Ruijzenaars",
  isActive: 1,
  emailAdress: "jw.ruijzenaar@student.avans.nl",
  password: "secret",
  phoneNumber: "064451",
  roles: "editor,guest",
  street: "Lovensdijkstraat",
  city: "Breda",
};

const updatedUser = {
  id: 1,
  firstName: "Jan Willem",
  lastName: "Ruijzenaars",
  isActive: 1,
  emailAdress: "jw.ruijzenaars@student.avans.nl",
  password: "secret",
  phoneNumber: "0644518692",
  roles: "editor,guest",
  street: "Professor Cobbenhagenlaan",
  city: "Tilburg",
};

describe("user tests", () => {
  beforeEach((done) => {
    pool.query(queries.CLEAR_DB_USER, (err, rows, fields) => {
      if (err) {
        console.log(`beforeEach CLEAR error: ${err}`);
        done(err);
      } else {
        done();
      }
    });
  });

  describe("TC-201 create user", () => {
    it("TC-201-1 shouldn't create user, missing field", (done) => {
      chai
        .request(server)
        .post("/api/user")
        .send(missingFieldUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property("error")
            .eq(
              "AssertionError [ERR_ASSERTION]: phoneNumber must be a string."
            );
          res.body.should.have.property("message").eq("Failed validation");
          res.body.should.have.property("status").eq(400);
          done();
        });
    });
    it("TC-201-2 shouldn't create user, invalid email", (done) => {
      chai
        .request(server)
        .post("/api/user")
        .send(invalidEmailUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("message").eq("Failed validation");
          res.body.should.have
            .property("error")
            .eq("AssertionError [ERR_ASSERTION]: email is invalid.");
          res.body.should.have.property("status").eq(400);
          done();
        });
    });

    it("TC-201-3 shouldn't create user, invalid password", (done) => {
      chai
        .request(server)
        .post("/api/user")
        .send(invalidPasswordUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("message").eq("Failed validation");
          res.body.should.have
            .property("error")
            .eq(
              "AssertionError [ERR_ASSERTION]: password is invalid, must be at least 4 characters long."
            );
          res.body.should.have.property("status").eq(400);
          done();
        });
    });

    describe("", () => {
      beforeEach((done) => {
        pool.query(
          queries.USER_CREATE,
          [
            expectedUser.firstName,
            expectedUser.lastName,
            expectedUser.isActive,
            expectedUser.emailAdress,
            expectedUser.password,
            expectedUser.phoneNumber,
            expectedUser.roles,
            expectedUser.street,
            expectedUser.city,
          ],
          (err, rows, fields) => {
            if (err) {
              console.log(`before CREATE error: ${err}`);
              done(err);
            } else {
              done();
            }
          }
        );
      });

      it("TC-201-4 user already exists", (done) => {
        chai
          .request(server)
          .post("/api/user")
          .send(expectedUser)
          .end((err, res) => {
            res.should.have.status(403);
            res.body.should.have
              .property("message")
              .eq("Email is already in use");
            res.body.should.have.property("status").eq(403);
            done();
          });
      });
    });

    it("TC-201-5 should create user", (done) => {
      chai
        .request(server)
        .post("/api/user")
        .send(expectedUser)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("message").eq("User created");
          res.body.should.have.property("status").eq(200);
          res.body.should.have.property("data");
          res.body.data.should.be.a("object");
          res.body.data.should.have.property("id");
          res.body.data.id.should.be.a("number");
          res.body.data.should.have.property("token");
          done();
        });
    });
  });

  describe("TC-202 getAll users", () => {
    it("TC-202-1 should return all users", (done) => {
      chai
        .request(server)
        .post("/api/user/")
        .send(expectedUsers[0])
        .end((err, res) => {
          chai
            .request(server)
            .post("/api/user/")
            .send(expectedUsers[1])
            .end((err, res) => {
              chai
                .request(server)
                .get("/api/user/")
                .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.have.property("data");
                  res.body.should.have.property("message").eq("Got all users");
                  res.body.should.have.property("status").eq(200);
                  res.body.data.should.be.a("array");
                  res.body.data.length.should.be.eq(expectedUsers.length);
                  for (let i = 0; i < res.body.data.length; i++) {
                    assert.deepStrictEqual(
                      res.body.data[i].firstName,
                      expectedUsers[i].firstName
                    );
                    assert.deepStrictEqual(
                      res.body.data[i].lastName,
                      expectedUsers[i].lastName
                    );
                    assert.deepStrictEqual(
                      res.body.data[i].isActive,
                      expectedUsers[i].isActive
                    );
                    assert.deepStrictEqual(
                      res.body.data[i].emailAdress,
                      expectedUsers[i].emailAdress
                    );
                    assert.deepStrictEqual(
                      res.body.data[i].phoneNumber,
                      expectedUsers[i].phoneNumber
                    );
                    assert.deepStrictEqual(
                      res.body.data[i].roles,
                      expectedUsers[i].roles
                    );
                    assert.deepStrictEqual(
                      res.body.data[i].street,
                      expectedUsers[i].street
                    );
                    assert.deepStrictEqual(
                      res.body.data[i].city,
                      expectedUsers[i].city
                    );
                  }
                  done();
                });
            });
        });
    });

    it("TC-202-2 shouldn return all users when filtered on firstname(non-existent filter)", (done) => {
      chai
        .request(server)
        .post("/api/user/")
        .send(expectedUsers[0])
        .end((err, res) => {
          chai
            .request(server)
            .post("/api/user/")
            .send(expectedUsers[1])
            .end((err, res) => {
              chai
                .request(server)
                .get("/api/user?firstName=John")
                .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.have.property("message").eq("Got all users");
                  res.body.should.have.property("status").eq(200);
                  done();
                });
            });
        });
    });

    // it("TC-202-3 should return users where isActive = false", (done) => {
    // });

    // it("TC-202-4 should return users where isActive = true", (done) => {
    // });

    it("TC-202-5 should return users where city = Breda and roles = guest", (done) => {
      chai
        .request(server)
        .post("/api/user/")
        .send(expectedUsers[0])
        .end((err, res) => {
          chai
            .request(server)
            .post("/api/user/")
            .send(expectedUsers[1])
            .end((err, res) => {
              chai
                .request(server)
                .get("/api/user?city=Breda&roles=guest")
                .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.have.property("data");
                  res.body.should.have
                    .property("message")
                    .eq("Got all users filtered by city and roles");
                  res.body.should.have.property("status").eq(200);
                  res.body.data.should.be.a("array");
                  res.body.resultCount.should.be.eq(1);
                  assert.deepStrictEqual(res.body.data[0].city, "Breda");
                  assert.deepStrictEqual(
                    res.body.data[0].roles,
                    "editor,guest"
                  );
                  done();
                });
            });
        });
    });

    it("TC-202-6 should return 404 not found when no users were found", (done) => {
      chai
        .request(server)
        .get("/api/user")
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property("message").eq("No users found");
          res.body.should.have.property("status").eq(404);
          done();
        });
    });
  });

  describe("TC-203 user profile", () => {
    it("TC-203-1 should return 401 not authorized when token is invalid", (done) => {
      const userToken = "invalidToken";
      chai
        .request(server)
        .post("/api/user/")
        .send(expectedUser)
        .end((err, res) => {
          chai
            .request(server)
            .get("/api/user/profile")
            .auth(userToken, { type: "bearer" })
            .end((err, res) => {
              res.should.have.status(401);
              res.body.should.have.property("message").eq(`Not authorized`);
              res.body.should.have.property("status").eq(401);
              done();
            });
        });
    });

    it("TC-203-2 should return own profile", (done) => {
      let userId;
      let userToken;
      chai
        .request(server)
        .post("/api/user/")
        .send(expectedUser)
        .end((err, res) => {
          userId = res.body.data.id;
          userToken = res.body.data.token;
          chai
            .request(server)
            .get("/api/user/own/profile")
            .auth(userToken, { type: "bearer" })
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.have.property("data");
              res.body.should.have
                .property("message")
                .eq(`Got user with Id ${userId}`);
              res.body.should.have.property("status").eq(200);
              res.body.data.should.be.a("object");
              assert.deepStrictEqual(res.body.data.firstName, "Jan Willem");
              assert.deepStrictEqual(res.body.data.lastName, "Ruijzenaars");
              assert.deepStrictEqual(res.body.data.isActive, 1);
              assert.deepStrictEqual(
                res.body.data.emailAdress,
                "jw.ruijzenaars@student.avans.nl"
              );
              assert.deepStrictEqual(res.body.data.phoneNumber, "06 12425475");
              assert.deepStrictEqual(res.body.data.roles, "editor,guest");
              assert.deepStrictEqual(res.body.data.street, "Lovensdijkstraat");
              assert.deepStrictEqual(res.body.data.city, "Breda");
              done();
            });
        });
    });
  });

  describe("TC-204 get user by id", () => {
    it("TC-204-1 should return 401 not authorized when token is invalid", (done) => {
      const userToken = "invalidToken";
      chai
        .request(server)
        .post("/api/user/")
        .send(expectedUser)
        .end((err, res) => {
          chai
            .request(server)
            .get("/api/user/" + res.body.data.id)
            .auth(userToken, { type: "bearer" })
            .end((err, res) => {
              res.should.have.status(401);
              res.body.should.have.property("message").eq(`Not authorized`);
              res.body.should.have.property("status").eq(401);
              done();
            });
        });
    });

    it("TC-204-2 should return 404 not found when user is not found", (done) => {
      let userToken;
      chai
        .request(server)
        .post("/api/user/")
        .send(expectedUser)
        .end((err, res) => {
          userId = res.body.data.id;
          userToken = res.body.data.token;
          chai
            .request(server)
            .get("/api/user/" + 0)
            .auth(userToken, { type: "bearer" })
            .end((err, res) => {
              res.should.have.status(404);
              res.body.should.have
                .property("message")
                .eq(`User with Id 0 not found`);
              res.body.should.have.property("status").eq(404);
              done();
            });
        });
    });

    it("TC-204-3 should return user by id", (done) => {
      let userId;
      let userToken;
      chai
        .request(server)
        .post("/api/user/")
        .send(expectedUser)
        .end((err, res) => {
          userId = res.body.data.id;
          userToken = res.body.data.token;
          chai
            .request(server)
            .get("/api/user/" + res.body.data.id)
            .auth(userToken, { type: "bearer" })
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.have.property("data");
              res.body.should.have
                .property("message")
                .eq(`Got user with Id ${userId}`);
              res.body.should.have.property("status").eq(200);
              res.body.data.should.be.a("object");
              assert.deepStrictEqual(res.body.data.firstName, "Jan Willem");
              assert.deepStrictEqual(res.body.data.lastName, "Ruijzenaars");
              assert.deepStrictEqual(res.body.data.isActive, 1);
              assert.deepStrictEqual(
                res.body.data.emailAdress,
                "jw.ruijzenaars@student.avans.nl"
              );
              assert.deepStrictEqual(res.body.data.phoneNumber, "06 12425475");
              assert.deepStrictEqual(res.body.data.roles, "editor,guest");
              assert.deepStrictEqual(res.body.data.street, "Lovensdijkstraat");
              assert.deepStrictEqual(res.body.data.city, "Breda");
              done();
            });
        });
    });
  });

  describe("TC-205 update user", () => {
    it("TC-205-1 should fail, missing email", (done) => {
      let userToken;
      let userId;
      chai
        .request(server)
        .post("/api/user/")
        .send(expectedUser)
        .end((err, res) => {
          userId = res.body.data.id;
          userToken = res.body.data.token;
          chai
            .request(server)
            .put("/api/user/" + userId)
            .auth(userToken, { type: "bearer" })
            .send(missingEmailUser)
            .end((err, res) => {
              res.should.have.status(400);
              res.body.should.have.property("message").eq(`Failed validation`);
              res.body.should.have.property("status").eq(400);
              res.body.should.have
                .property("error")
                .eq("AssertionError [ERR_ASSERTION]: email is invalid.");
              done();
            });
        });
    });

    it("TC-205-2 should return 401 not authorized when token is invalid", (done) => {
      let userToken = "invalidToken";
      let userId;
      chai
        .request(server)
        .post("/api/user/")
        .send(expectedUser)
        .end((err, res) => {
          userId = res.body.data.id;
          chai
            .request(server)
            .put("/api/user/" + userId)
            .auth(userToken, { type: "bearer" })
            .send(updatedUser)
            .end((err, res) => {
              res.should.have.status(401);
              res.body.should.have.property("message").eq(`Not authorized`);
              res.body.should.have.property("status").eq(401);
              done();
            });
        });
    });

    it("TC-205-3 should fail, invalid phoneNumber", (done) => {
      let userToken;
      let userId;
      chai
        .request(server)
        .post("/api/user/")
        .send(expectedUser)
        .end((err, res) => {
          userId = res.body.data.id;
          userToken = res.body.data.token;
          chai
            .request(server)
            .put("/api/user/" + userId)
            .auth(userToken, { type: "bearer" })
            .send(invalidPhoneNumberUser)
            .end((err, res) => {
              res.should.have.status(400);
              res.body.should.have.property("message").eq(`Failed validation`);
              res.body.should.have.property("status").eq(400);
              res.body.should.have
                .property("error")
                .eq("AssertionError [ERR_ASSERTION]: phoneNumber is invalid.");
              done();
            });
        });
    });

    it("TC-205-4 should return 404 not found, user doesn't exist", (done) => {
      let userToken;
      let userId;
      chai
        .request(server)
        .post("/api/user/")
        .send(expectedUser)
        .end((err, res) => {
          userId = res.body.data.id;
          userToken = res.body.data.token;
          chai
            .request(server)
            .put("/api/user/" + 0)
            .auth(userToken, { type: "bearer" })
            .send(updatedUser)
            .end((err, res) => {
              res.should.have.status(403);
              res.body.should.have
                .property("message")
                .eq(`Not authorized to update another user`);
              res.body.should.have.property("status").eq(403);
              done();
            });
        });
    });

    it("TC-205-5 should fail, not logged in(no auth header)", (done) => {
      let userToken;
      let userId;
      chai
        .request(server)
        .post("/api/user/")
        .send(expectedUser)
        .end((err, res) => {
          userId = res.body.data.id;
          userToken = res.body.data.token;
          chai
            .request(server)
            .put("/api/user/" + userId)
            .send(updatedUser)
            .end((err, res) => {
              res.should.have.status(401);
              res.body.should.have
                .property("message")
                .eq(`Authorization header missing!`);
              res.body.should.have.property("status").eq(401);
              done();
            });
        });
    });

    it("TC-205-6 should update user", (done) => {
      let userToken;
      let userId;
      chai
        .request(server)
        .post("/api/user/")
        .send(expectedUser)
        .end((err, res) => {
          userId = res.body.data.id;
          userToken = res.body.data.token;
          jwt.verify(userToken, process.env.JWT_SECRET, (err, decoded) => {
            logger.debug("decoded: " + JSON.stringify(decoded));
          });
          chai
            .request(server)
            .put("/api/user/" + userId)
            .auth(userToken, { type: "bearer" })
            .send(updatedUser)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.have.property("data");
              res.body.should.have
                .property("message")
                .eq(`Updated user with Id ${userId}`);
              res.body.should.have.property("status").eq(200);
              res.body.data.should.be.a("object");
              assert.deepStrictEqual(res.body.data.firstName, "Jan Willem");
              assert.deepStrictEqual(res.body.data.lastName, "Ruijzenaars");
              assert.deepStrictEqual(res.body.data.isActive, 1);
              assert.deepStrictEqual(
                res.body.data.emailAdress,
                "jw.ruijzenaars@student.avans.nl"
              );
              assert.deepStrictEqual(res.body.data.phoneNumber, "0644518692");
              assert.deepStrictEqual(res.body.data.city, "Tilburg");
              assert.deepStrictEqual(
                res.body.data.street,
                "Professor Cobbenhagenlaan"
              );
              assert.deepStrictEqual(res.body.data.roles, "editor,guest");
              done();
            });
        });
    });
  });

  describe("TC-206 delete user", () => {
    it("TC-206-1 should fail, user doesn't exist", (done) => {
      const userId = 0;
      const payload = {
        id: userId,
      };
      const userToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: "1h",
      });
      logger.debug("userToken: " + userToken)
      chai
        .request(server)
        .delete("/api/user/" + 0)
        .auth(userToken, { type: "bearer" })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have
            .property("message")
            .eq(`Couldn't find user with Id ${userId} to delete`);
          res.body.should.have.property("status").eq(404);
          done();
        });
    });

    it("TC-206-2 should fail, not logged in(no auth header)", (done) => {
      chai
        .request(server)
        .delete("/api/user/" + 0)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have
            .property("message")
            .eq(`Authorization header missing!`);
          res.body.should.have.property("status").eq(401);
          done();
        });
    });

    it("TC-206-3 should fail, user is not owner of data", (done) => {
      let userToken;
      let userId;
      chai
        .request(server)
        .post("/api/user/")
        .send(expectedUser)
        .end((err, res) => {
          userId = res.body.data.id;
          userToken = res.body.data.token;
          chai
            .request(server)
            .delete("/api/user/0")
            .auth(userToken, { type: "bearer" })
            .end((err, res) => {
              res.should.have.status(401);
              res.body.should.have
                .property("message")
                .eq(`Not authorized to delete another user`);
              res.body.should.have.property("status").eq(401);
              done();
            });
        });

    });

    it("TC-206-4 should delete user", (done) => {
      let userToken;
      let userId;
      chai
        .request(server)
        .post("/api/user/")
        .send(expectedUser)
        .end((err, res) => {
          userId = res.body.data.id;
          userToken = res.body.data.token;
          chai
            .request(server)
            .delete("/api/user/" + userId)
            .auth(userToken, { type: "bearer" })
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.have
                .property("message")
                .eq(`User with Id ${userId} is deleted`);
              res.body.should.have.property("status").eq(200);
              done();
            });
        });
    });
  });
});
