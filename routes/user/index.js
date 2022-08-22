const routes = require("express").Router();
const uploads = require('../../lib/multer');
var UserController = require("../../controllers/user.controller");

routes.post("/register",  UserController.UserRegister);
routes.post("/login", UserController.UserLogin);
routes.post("/forgotpassword", UserController.forgotPassword);
routes.put("/resetpassword", UserController.resetPassword);
routes.get("/getAllUsers", UserController.getAllUsers);
routes.get("/getUserById/:id", UserController.getUserById);

module.exports = routes;
