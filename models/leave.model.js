const sql = require("./db");

// constructor
const Leave = function (data) {
  this.userId = data.userId;
  this.startTime = data.startTime;
  this.endTime = data.endTime;
  this.title = data.title;
};

Leave.create = (leave, result) => {
  sql.query("INSERT INTO empleave SET ?", leave, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, "");
      return;
    }

    //console.log("res", res);
    result("", { id: res.insertId, ...leave });
  });
};

Leave.getLeaveHrs = (id, result) => {
  sql.query(
    `SELECT * FROM empleave WHERE userId ='${id}'  AND DATE(startTime)=CURRENT_DATE`,
    (err, res) => {
      if (err) {
        result(err, "");
        return;
      }
      if (result.length) {
        result("", res);
        return;
      }
      result("", "");
      return;
    }
  );
};

Leave.getAllLeaves = (id, result) => {
  sql.query(
    `SELECT title, startTime as startDate,endTime as endDate FROM empleave WHERE userId ='${id}'`,
    (err, res) => {
      if (err) {
        result(err, "");
        return;
      }
      if (result.length) {
        result("", res);
        return;
      }
      result("", "");
      return;
    }
  );
};

module.exports = Leave;
