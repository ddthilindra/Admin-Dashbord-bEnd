const Leave = require("../models/leave.model");
const globalMessage = require("../error/errors.message");
const date = require("date-and-time");

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

exports.getHrs = async (req, res) => {
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

  try {
    Leave.getLeaveHrs(req.params.id, (err, data) => {
      var allhours = "00:00";
      for (let x = 0; x < data.length; x++) {
        const element = data[x];

        //var hours = Math.abs(val1 - val2) / 36e5;

        //hours=date.format(element.endTime, "HH:mm:ss")-date.format(element.startTime, "HH:mm:ss");
        //hours+=(element.endTime/(1000 * 60 * 60).toFixed(1))-(element.startTime/(1000 * 60 * 60).toFixed(1));
        let milliseconds = element.endTime - element.startTime;

        // let seconds = Math.floor(milliseconds / 1000);
        // let minutes = Math.floor(seconds / 60);
        // let hours = Math.floor(minutes / 60);

        // seconds = seconds % 60;
        // minutes = minutes % 60;

        // hours = hours % 24;

        // const ms = hr;
        //const ddd = new Date();
        // const value1 = date.format(now, "YYYY/MM/DD");
        //console.log(new Date(milliseconds).toISOString().slice(11, 16)); // 👉️ 15:00:00
        var prehr;
        prehr = allhours;
        //console.log("pre " + prehr);
        allhours = new Date(milliseconds).toISOString().slice(11, 16);
        //console.log(allhours)
        //console.log(hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0")); // 👉️ 15:00:00

        // console.log(
        //   ">>>>>>>>>> " + padTo2Digits(hours) + ":" + padTo2Digits(minutes)
        // );

        allhours = addTimes(allhours, prehr);
        //allhours+=tot;
        console.log(">>>>>>>>>> " + allhours);

        // console.log(
        //   ">>>>>>>>>> " +addTimes( hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0"),hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0"))
        // );
        console.log(">>>>>>>>>> ");
      }

      console.log("Leave Hours >>> " + allhours);
      var whr = redTimes("09:00", allhours);
      console.log("Worked Hours >>> " + whr);
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

exports.getAllLeaves = async (req, res) => {
  try {
    Leave.getAllLeaves(req.params.id, (err, data) => {
      console.log(">>>>> "+data[0].startDate)
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