const sql = require("./db");

const User = function (user) {
  this.firstName = user.firstName;
  this.lastName = user.lastName;
  this.email = user.email;
  this.contactNo = user.contactNo;
  // this.houseNumber = user.houseNumber;
  // this.street = user.street;
  this.city = user.city;
  // this.profilePicture = user.profilePicture;
  this.hash = user.hash;
  this.salt = user.salt;
  // this.device_token = user.device_token;
  this.user_type = user.user_type;
};

User.create = (newUser, result) => {
  sql.query("INSERT INTO user SET ?", newUser, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, "");
      return;
    }

    result("", { id: res.insertId, ...newUser });
  });
};

User.findByUserEmail = (email, result) => {
  sql.query(`SELECT * FROM user WHERE email = '${email}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, "");
      return;
    }

    if (res.length) {
      result("", res);
      return;
    }

    result("", "");
    return;
  });
};

User.ResetPasswordUser = (id, updatedUser, result) => {
  sql.query(
    `UPDATE user SET hash='${updatedUser.hash}' ,salt ='${updatedUser.salt}' WHERE id='${id}'`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, "");
        return;
      }

      if (res.affectedRows === 1) {
        result("", { id: id, ...updatedUser });
        return;
      }

      result("", "");
      return;
    }
  );
};

User.updateUser = (id, updatedUser, result) => {
  sql.query(
    `UPDATE user SET username='${updatedUser.username}', email='${updatedUser.email}', mobileNumber= '${updatedUser.mobileNumber}', postalCode = '${updatedUser.postalCode}' , address = '${updatedUser.address}' , status ='${updatedUser.status}' WHERE id='${id}'`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, "");
        return;
      }

      if (res.affectedRows === 1) {
        result("", { id: id, ...updatedUser });
        return;
      }

      result("", "");
      return;
    }
  );
};

//getAllUsers
User.getAllUsers = (result) => {
  sql.query(
    "SELECT Id,firstName,lastName,email,contactNo,city,user_type FROM user",
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result("", err);
        return;
      }

      result("", res);
    }
  );
};

//getUserById
User.getUserById = (id, result) => {
  sql.query(
    `SELECT id,firstName,lastName,contactNo,city,user_type FROM user WHERE id = '${id}'`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result("", err);
        return;
      }

      result("", res);
    }
  );
};

//getDashboardDetails
User.getDashboardDetails = (id, result) => {
  sql.query(
    `Select u.Id, u.firstName , u.lastName , u.user_type, CONCAT(DATE_FORMAT(l.startTime, "%Y %b "),( 1 + ((DATE_FORMAT( DATE_ADD(LAST_DAY( DATE_ADD(l.startTime,
    INTERVAL -1 MONTH)), INTERVAL 1 DAY),'%w')+1) + 
    (DATE_FORMAT(l.startTime, '%d')-2) ) DIV 7)) as week, SEC_TO_TIME(SUM(TIME_TO_SEC(timediff(l.endTime, l.startTime)))) AS totalhours
  FROM empleave l
  INNER JOIN user u ON u.Id = l.userId
  WHERE WEEKOFYEAR(l.startTime)=WEEKOFYEAR(CURDATE()) AND status=2 AND u.id = '${id}'
  GROUP BY u.Id`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result("", err);
        return;
      }

      result("", res);
    }
  );
};

//updateProfile profilePicture
User.updateProfile = (id, updatedUser, result) => {
  sql.query(
    `UPDATE user SET 
    firstName='${updatedUser.firstName}',
    lastName='${updatedUser.lastName}',
    email='${updatedUser.email}',
    contactNo='${updatedUser.contactNo}',
    houseNumber='${updatedUser.houseNumber}',
    street='${updatedUser.street}',
    city='${updatedUser.city}',
    profilePicture='${updatedUser.profilePicture}',
    user_type='${updatedUser.user_type}'
    WHERE id='${id}'`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, "");
        return;
      } else {
        result("", { id, ...updatedUser });
        console.log(id);
      }
    }
  );
};

module.exports = User;
