const assert = require("assert");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../server");

chai.should();
chai.use(chaiHttp);

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
  allergenes: "gluten"
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
  allergenes: "gluten"
};

describe("meal tests", () => {
    describe("GET /meals", () => {
        it("should return all meals", (done) => {
            chai
                .request(server)
                .get("/api/meal")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    res.body.length.should.be.eq(expectedMeals.length);
                    for (let i = 0; i < res.body.length; i++) {
                        assert.deepStrictEqual(res.body[i], expectedMeals[i]);
                    }
                    done();
                });
        });
    });
});
