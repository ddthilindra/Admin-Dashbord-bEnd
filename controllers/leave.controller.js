const Leave = require("../models/leave.model");
const globalMessage = require("../error/errors.message");
const date = require("date-and-time");
const moment = require("moment");

exports.create = async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).json({
        code: globalMessage.BadCode,
        status: globalMessage.NotSuccess,
        message: globalMessage.ContentEmpty,
      });
    }
    // const now = new Date();
    // const value1 = date.format(now, "YYYY/MM/DD");
    // const value2 = date.format(now, "HH:mm:ss");

    const leave = new Leave({
      userId: req.body.userId,
      title: req.body.title,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      allDay: req.body.allDay,
      status: req.body.status,
    });

    Leave.create(leave, (err, data) => {
      if (err) {
        res.status(400).send({
          success: globalMessage.NotSuccess,
          code: globalMessage.BadCode,
          status: globalMessage.SeverErrorMessage,
          message: err.message,
        });
      } else {
        res.status(200).json({
          success: globalMessage.Success,
          code: globalMessage.SuccessCode,
          status: globalMessage.SuccessStatus,
          data: data,
          message: globalMessage.CreateSuccessMessage,
        });
      }
    });
  } catch (error) {
    return res.status(500).send({
      success: globalMessage.NotSuccess,
      code: globalMessage.ServerCode,
      status: globalMessage.SeverErrorMessage,
      message: error.message,
    });
  }
};
// Convert a time in hh:mm format to minutes
function timeToMins(time) {
  var b = time.split(":");
  return b[0] * 60 + +b[1];
}

// Convert minutes to a time in format hh:mm
// Returned value is in range 00  to 24 hrs
function timeFromMins(mins) {
  function z(n) {
    return (n < 10 ? "0" : "") + n;
  }
  var h = ((mins / 60) | 0) % 24;
  var m = mins % 60;
  return z(h) + ":" + z(m);
}

// Add two times in hh:mm format
function addTimes(t0, t1) {
  return timeFromMins(timeToMins(t0) + timeToMins(t1));
}
function redTimes(t0, t1) {
  return timeFromMins(timeToMins(t0) - timeToMins(t1));
}
exports.getHrs = async (req, res) => {
  try {
    Leave.getLeaveHrs(req.params.id, (err, data) => {
      var allhours = "00:00";
      for (let x = 0; x < data.length; x++) {
        const element = data[x];

        let milliseconds = element.endTime - element.startTime;

        var prehr;
        prehr = allhours;

        allhours = new Date(milliseconds).toISOString().slice(11, 16);

        allhours = addTimes(allhours, prehr);

        // console.log(">>>>>>>>>> " + allhours);
      }

      // console.log("Leave Hours >>> " + allhours);
      var whr = redTimes("09:00", allhours);
      // console.log("Worked Hours >>> " + whr);
      if (err) {
        return res.status(400).send({
          success: globalMessage.NotSuccess,
          code: globalMessage.BadCode,
          status: globalMessage.SeverErrorMessage,
          message: err.message,
        });
      }
      if (data.length) {
        return res.status(200).json({
          success: globalMessage.Success,
          code: globalMessage.SuccessCode,
          status: globalMessage.SuccessStatus,
          workedhr: whr,
          leaveHr: allhours,
          message: globalMessage.ItemReceived,
        });
      } else {
        return res.status(400).send({
          success: globalMessage.Success,
          code: globalMessage.SuccessCode,
          status: globalMessage.SuccessStatus,
          data: data,
          message: globalMessage.NoData,
        });
      }
    });
  } catch (error) {
    return res.status(500).send({
      success: globalMessage.NotSuccess,
      code: globalMessage.ServerCode,
      status: globalMessage.SeverErrorMessage,
      message: error.message,
    });
  }
};

exports.getAllHrs = async (req, res) => {
  try {
    Leave.getAllHrs((err, data) => {
      // console.log(data);
      if (err) {
        return res.status(400).send({
          success: globalMessage.NotSuccess,
          code: globalMessage.BadCode,
          status: globalMessage.SeverErrorMessage,
          message: err.message,
        });
      }
      if (data.length) {
        return res.status(200).json({
          success: globalMessage.Success,
          code: globalMessage.SuccessCode,
          status: globalMessage.SuccessStatus,
          data: data,
          message: globalMessage.ItemReceived,
        });
      } else {
        return res.status(400).send({
          success: globalMessage.Success,
          code: globalMessage.SuccessCode,
          status: globalMessage.SuccessStatus,
          data: data,
          message: globalMessage.NoData,
        });
      }
    });
  } catch (error) {
    return res.status(500).send({
      success: globalMessage.NotSuccess,
      code: globalMessage.ServerCode,
      status: globalMessage.SeverErrorMessage,
      message: error.message,
    });
  }
};

exports.getAllHrsById = async (req, res) => {
  try {
    Leave.getAllHrsById(req.params.id, (err, data) => {
      //console.log(data);
      if (err) {
        return res.status(400).send({
          success: globalMessage.NotSuccess,
          code: globalMessage.BadCode,
          status: globalMessage.SeverErrorMessage,
          message: err.message,
        });
      }
      if (data.length) {
        return res.status(200).json({
          success: globalMessage.Success,
          code: globalMessage.SuccessCode,
          status: globalMessage.SuccessStatus,
          data: data,
          message: globalMessage.ItemReceived,
        });
      } else {
        return res.status(400).send({
          success: globalMessage.Success,
          code: globalMessage.SuccessCode,
          status: globalMessage.SuccessStatus,
          data: data,
          message: globalMessage.NoData,
        });
      }
    });
  } catch (error) {
    return res.status(500).send({
      success: globalMessage.NotSuccess,
      code: globalMessage.ServerCode,
      status: globalMessage.SeverErrorMessage,
      message: error.message,
    });
  }
};
exports.getAllLeaves = async (req, res) => {
  try {
    Leave.getAllLeaves(req.params.id, (err, data) => {
      // console.log(data);
      if (err) {
        return res.status(400).send({
          success: globalMessage.NotSuccess,
          code: globalMessage.BadCode,
          status: globalMessage.SeverErrorMessage,
          message: err.message,
        });
      }
      if (data.length) {
        return res.status(200).json({
          success: globalMessage.Success,
          code: globalMessage.SuccessCode,
          status: globalMessage.SuccessStatus,
          data: data,
          message: globalMessage.ItemReceived,
        });
      } else {
        return res.status(400).send({
          success: globalMessage.Success,
          code: globalMessage.SuccessCode,
          status: globalMessage.SuccessStatus,
          data: data,
          message: globalMessage.NoData,
        });
      }
    });
  } catch (error) {
    return res.status(500).send({
      success: globalMessage.NotSuccess,
      code: globalMessage.ServerCode,
      status: globalMessage.SeverErrorMessage,
      message: error.message,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    Leave.getLeaveById(req.params.id, async (err, data) => {
      if (err) {
        return res.status(400).json({
          success: globalMessage.NotSuccess,
          code: globalMessage.BadCode,
          status: globalMessage.SeverErrorMessage,
          message: err.message,
        });
      }
      if (data.length) {
        Leave.delete(req.params.id, (err, data) => {
          if (err) {
            return res.status(500).send({
              success: globalMessage.NotSuccess,
              code: globalMessage.ServerCode,
              status: globalMessage.SeverErrorMessage,
              message: err.message,
            });
          }
          if (data.affectedRows === 1) {
            return res.status(200).json({
              success: globalMessage.Success,
              code: globalMessage.SuccessCode,
              status: globalMessage.SuccessStatus,
              message: globalMessage.ItemDeletedMsg,
            });
          }
        });
      } else {
        return res.status(200).json({
          success: globalMessage.Success,
          code: globalMessage.SuccessCode,
          status: globalMessage.SuccessStatus,
          data: data,
          message: globalMessage.NoData,
        });
      }
    });
  } catch (error) {
    return res.status(500).send({
      success: globalMessage.NotSuccess,
      code: globalMessage.ServerCode,
      status: globalMessage.SeverErrorMessage,
      message: error.message,
    });
  }
};

exports.update = async function (req, res) {
  var t = "",
    s = "",
    e = "";
    console.log(req.body.status)
  try {
    Leave.getLeaveById(req.body.id, (err, data) => {
      if (err) {
        return res.status(500).send({
          success: globalMessage.NotSuccess,
          code: globalMessage.ServerCode,
          status: globalMessage.SeverErrorMessage,
          message: err.message,
        });
      }
      if (data.length) {
        if (data[0].startTime) {
          s = moment(data[0].startTime).format("YYYY/MM/D hh:mm:ss");
        }

        if (data[0].endTime) {
          e = moment(data[0].endTime).format("YYYY/MM/D hh:mm:ss");
        }
        const updateLeave = new Leave({
          title: req.body.title || data[0].title,
          startTime: req.body.startTime || s,
          endTime: req.body.endTime || e,
          allDay: req.body.allDay || data[0].allDay,
          status: req.body.status || data[0].status,
        });
        Leave.updateLeave(req.body.id, updateLeave, (err, data) => {
          if (err) {
            return res.status(500).send({
              success: globalMessage.NotSuccess,
              code: globalMessage.ServerCode,
              status: globalMessage.SeverErrorMessage,
              message: err.message,
            });
          } else {
            return res.status(200).json({
              success: globalMessage.Success,
              code: globalMessage.SuccessCode,
              status: globalMessage.SuccessStatus,
              document: data,
              message: globalMessage.UpdateSuccessMessage,
            });
          }
        });
      }
    });
  } catch (e) {
    return res.status(400).json({
      success: globalMessage.NotSuccess,
      code: globalMessage.BadCode,
      status: globalMessage.BadMessage,
      message: e.message,
    });
  }
};
