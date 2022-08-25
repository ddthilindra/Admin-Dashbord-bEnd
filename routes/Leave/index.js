const routes=require("express").Router();
var LeaveController=require("../../controllers/leave.controller")

routes.post("/addLeave",LeaveController.create)
routes.get("/getLeaveHrs/:id",LeaveController.getHrs)
routes.get("/getAllLeaveHrs/:id",LeaveController.getAllHrs)
routes.get("/getAllHrsById/:id",LeaveController.getAllHrsById)
routes.get("/getAllLeaves/:id",LeaveController.getAllLeaves)
routes.delete("/deleteLeave/:id",LeaveController.delete)
routes.put("/updateLeave",LeaveController.update)

module.exports=routes;