const assert = require("assert");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../server");
const queries = require("../../src/daos/queries");
const logger = require("../../src/config").logger;
const jwt = require("jsonwebtoken");
const dbTestConfig = require("../../src/config").dbTestConfig;
const mysql = require("mysql2");
const exp = require("constants");
const pool = mysql.createPool(dbTestConfig);
logger.trace("Connected to database: " + dbTestConfig.database);

chai.should();
chai.use(chaiHttp);

const emptyData = {};

const expectedFullUser = {
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

const expectedUser = {
  emailAdress: "jw.ruijzenaars@student.avans.nl",
  password: "secret",
};

const invalidPasswordUser = {
  emailAdress: "jw.ruijzenaars@student.avans.nl",
  password: "wrongPassword",
};

const missingEmailUser = {
  password: "secret",
};

describe("auth test", () => {
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
  afterEach((done) => {
    pool.query(queries.CLEAR_DB_USER, (err, res) => {
      if (err) {
        done(err);
      }
      done();
    });
  });

  describe("TC-101 login", () => {
    it("TC-101-1 should fail, missing required field(email)", (done) => {
      chai
        .request(server)
        .post("/api/user/")
        .send(expectedFullUser)
        .end((err, res) => {
          chai
            .request(server)
            .post("/api/login/")
            .send(missingEmailUser)
            .end((err, res) => {
              res.should.have.status(400);
              res.body.should.have.property("message").eq("Failed validation");
              res.body.should.have
                .property("data")
                .eq(
                  "AssertionError [ERR_ASSERTION]: emailAdress must be a string."
                );
              res.body.should.have.property("status").eq(400);
              done();
            });
        });
    });

    it("TC-101-2 should fail, invalid password", (done) => {
      chai
        .request(server)
        .post("/api/user/")
        .send(expectedFullUser)
        .end((err, res) => {
          chai
            .request(server)
            .post("/api/login/")
            .send(invalidPasswordUser)
            .end((err, res) => {
              res.should.have.status(400);
              res.body.should.have
                .property("message")
                .eq("Wrong password or email combination");
              res.body.should.have.property("status").eq(400);
              res.body.should.have.property("data").eq(null);
              done();
            });
        });
    });

    it("TC-101-3 should fail, user doesn't exist", (done) => {
      chai
        .request(server)
        .post("/api/login/")
        .send(expectedUser)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property("message").eq("User not found");
          res.body.should.have.property("status").eq(404);
          res.body.should.have.property("data").eq(null);
          done();
        });
    });

    it("TC-101-4 should login", (done) => {
      chai
        .request(server)
        .post("/api/user/")
        .send(expectedFullUser)
        .end((err, res) => {
            const userId = res.body.data.id;
          chai
            .request(server)
            .post("/api/login/")
            .send(expectedUser)
            .end((err, res) => {
                console.log(res.body);
              res.should.have.status(200);
              res.body.should.have.property("message").eq("Login successful");
              res.body.should.have.property("status").eq(200);
              res.body.should.have.property("data");
              res.body.data.should.have.property("token");
              res.body.data.should.have.property("id").eq(userId);
              res.body.data.should.have
                .property("firstName")
                .eq(expectedFullUser.firstName);
              res.body.data.should.have
                .property("lastName")
                .eq(expectedFullUser.lastName);
              res.body.data.should.have
                .property("isActive")
                .eq(expectedFullUser.isActive);
              res.body.data.should.have
                .property("emailAdress")
                .eq(expectedFullUser.emailAdress);
              res.body.data.should.have
                .property("phoneNumber")
                .eq(expectedFullUser.phoneNumber);
              res.body.data.should.have
                .property("roles")
                .eq(expectedFullUser.roles);
              res.body.data.should.have
                .property("street")
                .eq(expectedFullUser.street);
              res.body.data.should.have
                .property("city")
                .eq(expectedFullUser.city);
                done();
            });
        });
    });
  });
});

describe("systeminfo test", () => {
  describe("TC-102 get systeminfo", () => {
    it("TC-102-1 should return systeminfo", (done) => {
      chai
        .request(server)
        .get("/api/info")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have
            .property("message")
            .eq("Systeminfo for share-a-meal");
          res.body.should.have.property("status").eq(200);
          res.body.should.have.property("data");
          res.body.data.should.have
            .property("studentName")
            .eq("Jan Willem Ruijzenaars");
          res.body.data.should.have.property("studentNumber").eq(2150617);
          res.body.data.should.have
            .property("description")
            .eq(
              "A system for students to manage their meals in their student homes"
            );
          done();
        });
    });
  });
});
