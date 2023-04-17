module.exports = {
    MEAL_CREATE:
      "INSERT INTO meal (isActive, isVega, isVegan, isToTakeHome, dateTime, maxAmountOfParticipants, price, imageUrl, cookId, createDate, updateDate, name, description, allergenes) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    MEAL_SELECT_ONE: "SELECT * FROM meal WHERE id = ?",
    MEAL_SELECT_All: "SELECT * FROM meal",
    MEAL_UPDATE:
      "UPDATE meal SET isActive = ?, isVega = ?, isVegan = ?, isToTakeHome = ?, dateTime = ?, maxAmountOfParticipants = ?, price = ?, imageUrl = ?, cookId = ?, createDate = ?, updateDate = ?, name = ?, description = ?, allergenes = ? WHERE id = ?",
    MEAL_DELETE: "DELETE FROM meal WHERE id = ?",
    USER_SELECT_ALL: "SELECT firstName, lastName, isActive, emailAdress, phoneNumber, roles, street, city FROM user",
    USER_SELECT_OWN_PROFILE: "SELECT * FROM user WHERE id = ?",
    USER_SELECT_ONE: "SELECT firstName, lastName, isActive, emailAdress, phoneNumber, roles, street, city FROM user WHERE id = ?",
    USER_UPDATE:
      "UPDATE user SET firstName = ?, lastName = ?, isActive = ?, emailAdress = ?, password = ?, phoneNumber = ?, roles = ?, street = ?, city = ? WHERE id = ?",
    USER_DELETE: "DELETE FROM user WHERE id = ?",
    USER_CREATE:
      "INSERT INTO user (firstName, lastName, isActive, emailAdress, password, phoneNumber, roles, street, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    USER_LOGIN: "SELECT * FROM user WHERE emailAdress = ?",
    TOKEN_RENEW: "SELECT * FROM user WHERE id = ?",
    PARTICIPATION_CREATE:
      "INSERT INTO `meal_participants_user` (mealId, userId) VALUES (?, ?)",
    PARTICIPATION_DELETE:
      "DELETE FROM `meal_participants_user` WHERE mealId = ? AND userId = ?",
    PARTICIPATION_SELECT_ONE:
      "SELECT firstName, lastName, isActive, emailAdress, phoneNumber, roles, street, city FROM user WHERE id = ?",
    PARTICIPATION_SELECT_ALL:
      "SELECT * FROM user LEFT JOIN meal_participants_user ON user.id = meal_participants_user.userId WHERE meal_participants_user.mealId = ?",
    CLEAR_DB_USER: "DELETE IGNORE FROM user",
    CLEAR_DB_MEAL: "DELETE IGNORE FROM meal",
    CLEAR_DB_PARTICIPATION: "DELETE IGNORE FROM meal_participants_user"
  };