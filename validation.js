const Joi = require("@hapi/joi");

//User
const userRegisterValidation = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().min(6).required(),
    lastName: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    contactNo: Joi.string()
      .regex(/^([+]\d{2})?\d{10}$/)
      .message("Phone number sholud be corrected")
      .required(),
    // houseNumber: Joi.string().min(6).required(),
    // street: Joi.string().min(6).required(),
    city: Joi.string().min(6).required(),
    password: Joi.string().min(6).required(),
    // device_token: Joi.string().required(),
    user_type: Joi.string(),
  });
  return schema.validate(data);
};

const UserLoginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    // device_token: Joi.string().required(),
  });
  return schema.validate(data);
};

// Professional

const ProfessionalRegisterValidation = (data) => {
  const schema = Joi.object({
    professionalName: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    mobileNumber: Joi.string()
      .regex(/^([+]\d{2})?\d{10}$/)
      .message("Phone number sholud be corrected")
      .required(),
    address: Joi.string().min(6).required(),
    profession: Joi.string().min(6).required(),
    businessName: Joi.string().min(6).required(),
    businessDescription: Joi.string().min(6).required(),
    status: Joi.bool(),
    certificate: Joi.string().required(),
    password: Joi.string().min(6).required(),
    device_token: Joi.string().required(),
  });
  return schema.validate(data);
};

const ProfessionalLoginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    device_token: Joi.string().required(),
  });
  return schema.validate(data);
};

//admin
const adminRegisterValidation = (data) => {
  const schema = Joi.object({
    admin_name: Joi.string().min(6).required(),
    email_address: Joi.string().min(6).required().email(),
    mobile_number: Joi.string()
      .regex(/^([+]\d{2})?\d{10}$/)
      .message("Phone number sholud be corrected")
      .required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().required(),
    device_token: Joi.string().required(),
  });
  return schema.validate(data);
};

const adminLoginValidation = (data) => {
  const schema = Joi.object({
    admin_name: Joi.string().min(6).required(),
    password: Joi.string().min(6).required(),
    confirm_password: Joi.string().min(6).required(),
    device_token: Joi.string().required(),
  });
  return schema.validate(data);
};

const adminUpdateValidation = (data) => {
  const schema = Joi.object({
    admin_name: Joi.string().min(6),
    email_address: Joi.string().min(6).email(),
    mobile_number: Joi.string()
      .regex(/^([+]\d{2})?\d{10}$/)
      .message("Phone number sholud be corrected"),
  });
  return schema.validate(data);
};

const SendReviewRequestValidation = (data) => {
  const schema = Joi.object({
    ProjectName: Joi.string().min(6).required(),
    HownerEmail: Joi.string().min(6).required().email(),
    HownerMobile: Joi.string()
      .regex(/^([+]\d{2})?\d{10}$/)
      .message("Phone number sholud be corrected")
      .required(),
  });
  return schema.validate(data);
};

module.exports.SendReviewRequestValidation = SendReviewRequestValidation;

module.exports.ProfessionalRegisterValidation = ProfessionalRegisterValidation;
module.exports.ProfessionalLoginValidation = ProfessionalLoginValidation;

module.exports.userRegisterValidation = userRegisterValidation;
module.exports.UserLoginValidation = UserLoginValidation;

module.exports.adminRegisterValidation = adminRegisterValidation;
module.exports.adminLoginValidation = adminLoginValidation;
module.exports.adminUpdateValidation = adminUpdateValidation;
