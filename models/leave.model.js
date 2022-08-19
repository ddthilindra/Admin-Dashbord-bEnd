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
    `SELECT Id as id,title, startTime as startDate,endTime as endDate FROM empleave WHERE userId ='${id}'`,
    (err, res) => {
      if (err) {
        result(err, "");
        return;
      }
      //console.log(result.length)
      if (result.length) {
        result("", res);
        return;
      }
      result("", "");
      return;
    }
  );
};

Leave.getLeaveById = (id, result) => {
  sql.query(`SELECT * FROM empleave WHERE Id = ${id}`, (err, res) => {
      if (err) {
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
}

Leave.delete = (id, result) => {
  sql.query(`DELETE FROM empleave WHERE Id = ${id}`, (err, res) => {
    if (err) {
      result(err, "");
      return;
    }

    if (res.affectedRows === 1) {
      result("", res);
      return;
    }

    result("", "");
    return;
  });
}

Leave.updateLeave = (id, updateLeave, result) => {
  //console.log(updateLeave)
  sql.query(`UPDATE empleave SET title='${updateLeave.title}',startTime='${updateLeave.startTime}',endTime='${updateLeave.endTime}' WHERE Id='${id}'`, (err, res) => {
      if (err) {
          console.log("error: ", err);
          result(err, "");
          return;
      }

      result("", { id: res.insertId, ...updateLeave });
  });
};

module.exports = Leave;
