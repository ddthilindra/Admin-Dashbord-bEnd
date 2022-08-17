const routes=require("express").Router();
var LeaveController=require("../../controllers/leave.controller")

routes.post("/addLeave",LeaveController.create)
routes.get("/getLeaveHrs/:id",LeaveController.getHrs)
routes.get("/getAllLeaves/:id",LeaveController.getAllLeaves)

module.exports=routes;