const routes=require("express").Router();
var LeaveController=require("../../controllers/leave.controller")

routes.post("/addLeave",LeaveController.create)
routes.get("/getLeaveHrs/:id",LeaveController.getHrs)

module.exports=routes;