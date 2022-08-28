const sql = require("./db");

// constructor
const Leave = function (data) {
  this.userId = data.userId;
  this.startTime = data.startTime;
  this.endTime = data.endTime;
  this.title = data.title;
  this.allDay = data.allDay;
  this.status = data.status;
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

Leave.getAllHrs = (result) => {
  sql.query(
    //`SELECT Id as id,title, startTime as startDate,endTime as endDate FROM empleave WHERE userId ='${id}'`,
    //   `Select l.Id, u.firstName , u.lastName , u.user_type, CONCAT(DATE_FORMAT(l.startTime, "%Y %b "),( 1 + ((DATE_FORMAT( DATE_ADD(LAST_DAY( DATE_ADD(l.startTime,
    //     INTERVAL -1 MONTH)), INTERVAL 1 DAY),'%w')+1) +
    //     (DATE_FORMAT(l.startTime, '%d')-2) ) DIV 7)) as week, SEC_TO_TIME(SUM(TIME_TO_SEC(timediff(l.endTime, l.startTime)))) AS totalhours
    // FROM empleave l
    // INNER JOIN user u ON u.Id = l.userId
    // WHERE userId = '${id}'
    // GROUP BY WEEk(l.startTime)
    `Select u.Id, u.firstName , u.lastName , u.user_type, CONCAT(DATE_FORMAT(l.startTime, "%Y %b "),( 1 + ((DATE_FORMAT( DATE_ADD(LAST_DAY( DATE_ADD(l.startTime,
      INTERVAL -1 MONTH)), INTERVAL 1 DAY),'%w')+1) + 
      (DATE_FORMAT(l.startTime, '%d')-2) ) DIV 7)) as week, SEC_TO_TIME(SUM(TIME_TO_SEC(timediff(l.endTime, l.startTime)))) AS totalhours
    FROM empleave l
    INNER JOIN user u ON u.Id = l.userId
    WHERE WEEKOFYEAR(l.startTime)=WEEKOFYEAR(CURDATE()) AND status=2
    GROUP BY u.Id
 `,
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

Leave.getAllHrsById = (id, result) => {
  sql.query(
    `Select l.Id, u.firstName , u.lastName , u.user_type, CONCAT(DATE_FORMAT(l.startTime, "%Y %b "),( 1 + ((DATE_FORMAT( DATE_ADD(LAST_DAY( DATE_ADD(l.startTime,
      INTERVAL -1 MONTH)), INTERVAL 1 DAY),'%w')+1) + 
      (DATE_FORMAT(l.startTime, '%d')-2) ) DIV 7)) as week, SEC_TO_TIME(SUM(TIME_TO_SEC(timediff(l.endTime, l.startTime)))) AS totalhours
  FROM empleave l
  INNER JOIN user u ON u.Id = l.userId
  WHERE userId = '${id}'
  GROUP BY WEEk(l.startTime)`,
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
Leave.getAllLeaves = (id, result) => {
  sql.query(
    //`SELECT Id as id,title, startTime as startDate,endTime as endDate FROM empleave WHERE userId ='${id}'`,
    `SELECT Id as id,title, DATE_FORMAT(startTime, "%a %b %d %Y  %T") as startDate,DATE_FORMAT(endTime, "%a %b %d %Y  %T") as endDate FROM empleave WHERE userId ='${id}'`,
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
};

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
};

Leave.updateLeave = (id, updateLeave, result) => {
  //console.log(updateLeave)
  sql.query(
    `UPDATE empleave SET title='${updateLeave.title}',startTime='${updateLeave.startTime}',endTime='${updateLeave.endTime}' WHERE Id='${id}'`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, "");
        return;
      }

      result("", { id: res.insertId, ...updateLeave });
    }
  );
};

module.exports = Leave;
