const User = require("../models/user.model");
const utils = require("../lib/lib");
const jsonwebtoken = require("jsonwebtoken");
const globalMessage = require("../error/errors.message");
const { sendForgotEmail } = require("../lib/emailServices");
const {
  userRegisterValidation,
  UserLoginValidation,
} = require("../validation");

exports.UserRegister = async function (req, res, next) {

  const { error } = userRegisterValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const saltHash = utils.genPassword(req.body.password);
  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const email = req.body.email;

  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    contactNo: req.body.contactNo,
    city: req.body.city,
    user_type: req.body.user_type,
    hash: hash,
    salt: salt,
  });

  try {
    if (!req.body) {
      res.status(400).json({
        code: 400,
        from: "DB",
        status: "BadRequest",
        message: "Content can not be empty!",
      });
    }
    User.findByUserEmail(email, (err, data) => {
      if (data && data.length) {
        return res.status(200).json({
          success: false,
          message: `${email} is already exists`,
        });
      } else {
        User.create(newUser, (err, data) => {
          if (err) {
            res.status(400).send({
              code: 400,
              status: "Error",
              message: err.message,
            });
          } else {
            const tokenObject = utils.issueUserJWT(data);

            res.status(200).json({
              success: true,
              device_id: req.body.device_token,
              token: tokenObject.token,
              expiresIn: tokenObject.expires,
              sub: tokenObject.sub,
              message: "Employee created successfully",
            });
          }
        });
      }
      if (err) {
        console.log("ERROR");
        return res.status(400).json({ status: 400, message: err });
      }
    });
  } catch (e) {
    return res.status(400).json({
      code: globalMessage.BadCode,
      status: globalMessage.BadMessage,
      message: e.message,
    });
  }
};

// user Login

exports.UserLogin = async function (req, res) {
  const { error } = UserLoginValidation(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });
  try {
    User.findByUserEmail(req.body.email, (err, user) => {
      if (err) {
        return res.status(500).send({
          success: globalMessage.NotSuccess,
          code: globalMessage.ServerCode,
          status: globalMessage.SeverErrorMessage,
          message: err.message,
        });
      }
      if (!user) {
        return res.status(201).json({
          success: false,
          message: "Invalid User email",
        });
      }

      const isValid = utils.validPassword(
        req.body.password,
        user[0].hash,
        user[0].salt
      );

      if (isValid) {
        const tokenObject = utils.issueUserJWT(user[0]);

        res.status(200).json({
          success: true,
          token: tokenObject.token,
          expiresIn: tokenObject.expires,
          sub: tokenObject.sub,
          user_type: user[0].user_type,
          message: "Login successful",
        });
      } else {
        res.status(203).json({
          success: false,
          status: "PasswordError",
          message: "you entered the wrong password",
        });
      }
    });
  } catch (e) {
    return res.status(400).json({
      code: globalMessage.BadCode,
      status: globalMessage.BadMessage,
      message: e.message,
    });
  }
};

exports.forgotPassword = async function (req, res, next) {
  try {
    User.findByUserEmail(req.body.email, (err, user) => {
      if (err) {
        return res.status(500).send({
          success: globalMessage.NotSuccess,
          code: globalMessage.ServerCode,
          status: globalMessage.SeverErrorMessage,
          message: err.message,
        });
      }
      if (user.length) {
        const user1 = user[0];
        const token = utils.issueUserJWT(user1);
        console.log(token.sub);
        sendForgotEmail(token.token, user1);
        return res.status(200).json({
          code: 200,
          success: true,
          data: "Please check your email to reset password.",
        });
      } else {
        return res.status(200).json({
          success: globalMessage.NotSuccess,
          code: globalMessage.SuccessCode,
          status: globalMessage.SuccessStatus,
          data: user,
          message: "Profile is not found",
        });
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};

exports.resetPassword = async function (req, res) {
  try {
    if (req.query.token) {
      const tokenParts = req.query.token.split(" ");
      if (
        tokenParts[0] === "Bearer" &&
        tokenParts[1].match(/\S+\.\S+\.\S+/) !== null
      ) {
        try {
          const verification = jsonwebtoken.verify(
            tokenParts[1],
            process.env.ACCESS_SECRET_TOKEN
          );
          console.log("Thilini" + verification.sub.email);
          User.findByUserEmail(verification.sub.email, (err, data) => {
            if (err) {
              return res.status(500).send({
                success: false,
                code: 500,
                status: "not success",
                message: "error",
              });
            }
            if (data.length) {
              console.log(data);
              const updateUser = data[0];

              const saltHash = utils.genPassword(req.body.password);
              const salt = saltHash.salt;
              const hash = saltHash.hash;

              const updating = {
                salt: salt,
                hash: hash,
              };

              User.ResetPasswordUser(updateUser.id, updating, (err, data) => {
                if (err)
                  return res.status(500).send({
                    success: false,
                    code: 500,
                    status: "not success",
                    message: err.message,
                  });
                else {
                  return res.status(200).json({
                    success: true,
                    code: 200,
                    status: "success",
                    user: data,
                    message: "Password reset successfully",
                  });
                }
              });
            } else {
              return res.status(200).send({
                success: true,
                code: 200,
                status: "success",
                data: data,
                message: "Token is invalid. Please contact us for assistance",
              });
            }
          });
        } catch (err) {
          res.status(200).json({
            code: 200,
            success: false,
            status: "Unauthorized",
            msg: "You are not authorized to visit this route 1",
          });
        }
      } else {
        res.status(200).json({
          code: 200,
          success: false,
          status: "Unauthorized",
          msg: "You are not authorized to visit this route 2",
        });
      }
    } else {
      res.status(200).json({
        code: 200,
        success: false,
        status: "TokenError",
        msg: "You are not authorized to visit this route 3",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};

//getAllUsers
exports.getAllUsers = async function (req, res) {
  try {
    User.getAllUsers((err, data) => {
      if (err) {
        return res.status(500).send({
          success: globalMessage.NotSuccess,
          code: globalMessage.ServerCode,
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
          message: "Users list",
        });
      } else {
        return res.status(200).json({
          success: globalMessage.NotSuccess,
          code: globalMessage.SuccessCode,
          status: globalMessage.SuccessStatus,
          data: data,
          message: "No Users found",
        });
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};

//getUserById
exports.getUserById = async function (req, res) {
  try {
    User.getUserById(req.params.id, (err, data) => {
      if (err) {
        return res.status(500).send({
          success: globalMessage.NotSuccess,
          code: globalMessage.ServerCode,
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
          message: "User details",
        });
      } else {
        return res.status(200).json({
          success: globalMessage.NotSuccess,
          code: globalMessage.SuccessCode,
          status: globalMessage.SuccessStatus,
          data: data,
          message: "No User found",
        });
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};
exports.getDashboardDetailsById = async function (req, res) {
  try {
    User.getDashboardDetails(req.jwt.sub.id, (err, data) => {
      if (err) {
        return res.status(500).send({
          success: globalMessage.NotSuccess,
          code: globalMessage.ServerCode,
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
          message: "User details",
        });
      } else {
        return res.status(200).json({
          success: globalMessage.NotSuccess,
          code: globalMessage.SuccessCode,
          status: globalMessage.SuccessStatus,
          data: data,
          message: "No User found",
        });
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};

exports.updateProfile = async function (req, res) {
  try {
    if (!req.body) {
      return res.status(400).send({
        success: globalMessage.NotSuccess,
        code: globalMessage.BadCode,
        status: globalMessage.BadMessage,
        message: globalMessage.ContentEmpty,
      });
    }

    User.getUserById(req.params.id, async (err, data) => {
      let result;
      // if (req.file) {
      //   result = await cloudinary.uploader.upload(
      //     req.file.path,
      //     { folder: "profilePicture" },
      //     function (error, result) {
      //       console.log(result, error);
      //     }
      //   );
      // }

      if (err) {
        return res.status(500).send({
          success: globalMessage.NotSuccess,
          code: globalMessage.ServerCode,
          status: globalMessage.SeverErrorMessage,
          message: err.message,
        });
      }

      if (data.length) {
        const updatedUser = new User({
          firstName: req.body.firstName || data[0].firstName,
          lastName: req.body.lastName || data[0].lastName,
          email: req.body.email || data[0].email,
          contactNo: req.body.contactNo || data[0].contactNo,
          // houseNumber: req.body.houseNumber || data[0].houseNumber,
          // street: req.body.street || data[0].street,
          city: req.body.city || data[0].city,
          // profilePicture: result?.secure_url || data[0].profilePicture,
          user_type: req.body.user_type || data[0].user_type,
        });
        User.updateProfile(req.params.id, updatedUser, (err, data) => {
          if (err) {
            return res.status(500).send({
              success: globalMessage.NotSuccess,
              code: globalMessage.ServerCode,
              status: globalMessage.SeverErrorMessage,
              message: err.message,
            });
          }
          if (data) {
            return res.status(200).json({
              success: globalMessage.Success,
              code: globalMessage.SuccessCode,
              status: globalMessage.SuccessStatus,
              data: data,
              message: "Updated successfully",
            });
          } else {
            return res.status(200).send({
              success: globalMessage.NotSuccess,
              code: globalMessage.SuccessCode,
              status: globalMessage.SuccessStatus,
              data: data,
              message: "User is not found",
            });
          }
        });
      } else {
        return res.status(200).send({
          success: globalMessage.NotSuccess,
          code: globalMessage.SuccessCode,
          status: globalMessage.SuccessStatus,
          data: data,
          message: "User is not found",
        });
      }
    });
  } catch (err) {
    return res.status(400).json({
      success: globalMessage.NotSuccess,
      code: globalMessage.BadCode,
      status: globalMessage.BadMessage,
      message: err.message,
    });
  }
};
