const routes = require("express").Router();

const utils = require("../../lib/lib");
var UserController = require("../../controllers/user.controller");

routes.post("/register",  UserController.UserRegister);
routes.post("/login", UserController.UserLogin);
routes.post("/forgotpassword", UserController.forgotPassword);
routes.put("/resetpassword", UserController.resetPassword);
routes.get("/getAllUsers", UserController.getAllUsers);
routes.get("/getUserById/:id", UserController.getUserById);
routes.get("/getDetailsById",utils.authMiddleware, UserController.getDashboardDetailsById);

module.exports = routes;
