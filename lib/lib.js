const crypto = require("crypto");
const jsonwebtoken = require("jsonwebtoken");
require("dotenv").config({ path: "../.env" });
/**

 * -------------- HELPER FUNCTIONS ----------------
 */

/**
 *
 * @param {*} password - The plain text password
 * @param {*} hash - The hash stored in the database
 * @param {*} salt - The salt stored in the database
 *
 * This function uses the crypto library to decrypt the hash using the salt and then compares
 * the decrypted hash/salt with the password that the user provided at login
 */

function validPassword(password, hash, salt) {
  var hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hash === hashVerify;
}

function genPassword(password) {
  var salt = crypto.randomBytes(32).toString("hex");
  var genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return {
    salt: salt,
    hash: genHash,
  };
}

//user

function issueUserJWT(user) {
  const expiresIn = "2w";

  const payload = {
    sub: {
      id: user.id,
      username: user.username,
      email: user.email,
      mobileNumber: user.mobileNumber,
      postalCode: user.postalCode,
      address: user.address,
    },
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(
    payload,
    process.env.ACCESS_SECRET_TOKEN,
    {
      expiresIn: expiresIn,
      //algorithm: 'RS256',
    }
  );

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
    sub: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  };
}

//Professional

function issueProfessionalJWT(professional) {
  const expiresIn = "2w";

  const payload = {
    sub: {
      id: professional.id,
      professionalName: professional.professionalName,
      email: professional.email,
      mobileNumber: professional.mobileNumber,
      address: professional.address,
      profession: professional.profession,
      businessName: professional.businessName,
      businessDescription: professional.businessDescription,
    },
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(
    payload,
    process.env.ACCESS_SECRET_TOKEN,
    {
      expiresIn: expiresIn,
      //algorithm: 'RS256',
    }
  );

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
    sub: {
      id: professional.id,
      professionalName: professional.professionalName,
      email: professional.email,
    },
  };
}

function authMiddleware(req, res, next) {
  if (req.headers.authorization) {
    const tokenParts = req.headers.authorization.split(" ");

    if (
      tokenParts[0] === "Bearer" &&
      tokenParts[1].match(/\S+\.\S+\.\S+/) !== null
    ) {
      try {
        const verification = jsonwebtoken.verify(
          tokenParts[1],
          process.env.ACCESS_SECRET_TOKEN,
       
        );
        req.jwt = verification;
        next();
      } catch (err) {
        res.status(401).json({
          success: false,
          status: "Unauthorized",
          msg: "You are not authorized to visit this route 1",
        });
      }
    } else {
      res.status(401).json({
        success: false,
        status: "Unauthorized",
        msg: "You are not authorized to visit this route 2",
      });
    }
  } else {
    res.status(401).json({
      success: false,
      status: "TokenError",
      msg: "You are not authorized to visit this route 3",
    });
  }
}

//admin
function issueAdminJWT(admin) {
  const expiresIn = '2w';

  const payload = {
    sub: {
      id: admin.id,
      admin_name: admin.admin_name,
      email_address: admin.email_address,
      mobile_number: admin.mobile_number,
      status : "ADMIN"
    },
    iat: Date.now()
  };

  const signedToken = jsonwebtoken.sign(payload, process.env.ACCESS_SECRET_TOKEN, { expiresIn: expiresIn });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
    sub: {
      id: admin.id,
      admin_name: admin.admin_name,
      email_address: admin.email_address,
      mobile_number: admin.mobile_number,
      role:admin.role,
    }
  }
}


function adminAuthMiddleware(req, res, next) {
  if (req.headers.authorization) {
    const tokenParts = req.headers.authorization.split(' ');
    
    if (tokenParts[0] === 'Bearer' && tokenParts[1].match(/\S+\.\S+\.\S+/) !== null) {


      try {
        const verification = jsonwebtoken.verify(tokenParts[1], process.env.ACCESS_SECRET_TOKEN);
        if(verification.sub.status=== "ADMIN"){
          req.jwt = verification;
          next();
        }else{
          res.status(210).json({ success: false, code:210, status: 'Unauthorized', msg: "You are not an admin" });
        }

      } catch (err) {
        res.status(210).json({ success: false, code:210, status: 'Unauthorized', msg: "You are not authorized to visit this route" });
      }

    } else {
      res.status(210).json({ success: false, code:210, status: 'Unauthorized', msg: "You are not authorized to visit this route" });
    }
  } else {
    res.status(210).json({ success: false, code:210, status: 'TokenError', msg: "You are not authorized to visit this route" });
  }
}

//new
module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
module.exports.authMiddleware = authMiddleware;
module.exports.issueUserJWT = issueUserJWT;
module.exports.issueProfessionalJWT = issueProfessionalJWT;
module.exports.issueAdminJWT = issueAdminJWT;
module.exports.adminAuthMiddleware = adminAuthMiddleware;