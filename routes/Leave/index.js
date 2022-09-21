const routes=require("express").Router();
var LeaveController=require("../../controllers/leave.controller")
const utils = require("../../lib/lib");

routes.post("/addLeave",utils.authMiddleware,LeaveController.create)
routes.get("/getLeaveHrs/:id",LeaveController.getHrs)
routes.get("/getAllLeaveHrs",LeaveController.getAllHrs)
routes.get("/getAllHrsById/:id",LeaveController.getAllHrsById)
routes.get("/getAllLeaves",utils.authMiddleware,LeaveController.getAllLeaves)
routes.get("/getAllLeavesById/:id",utils.authMiddleware,LeaveController.getAllLeavesById)
routes.delete("/deleteLeave/:id",LeaveController.delete)
routes.put("/updateLeave",LeaveController.update)

module.exports=routes;