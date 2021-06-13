const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const { errorMessage, errorDescription, successMessage } = require('../utils/const');
const { successAuthRes } = require('./response-models/successResponse');

/**
 *  Generate an encrypted JWT Token nested with:
 *  - User ID
 *  - User name
 * 
 * @param {*} userId 
 * @param {*} userName 
 * @returns 
 */
const createToken = (userId, userName) => {
  return jwt.sign(
    { id: userId, userName },
    process.env.JWT_STRING,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );
};


/**
 *  Authenticate & Login to an account
 *  
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.login = async (req, res, next) => {
  try {
    const { userName, password } = req.body;

    // Check user name and password availability
    if (!userName || !password) {
      return next(new AppError(404, errorDescription.missingCredentials, errorMessage.missingCredentials), req, res, next);
    }

    //Check existence user name
    const user = await User
                    .findOne({ userName })
                    .select("+password");           //Includes password
    
    //Check whether Password matches w/ db's password
    const isCorrectPassword = await user.validatePassword(password, user.password);
    
    //Check user existence + validity of password
    if (!user ||  
        !isCorrectPassword)  {
      return next(new AppError(401, errorDescription.wrongCredentials, errorMessage.wrongCredentials), req, res, next);
    }

    //Generate JWT token
    const token = createToken(user.id, user.user_name);

    //Successfully authenticated, returns JWT Token to user
    return res
            .status(200)
            .json(successAuthRes(successMessage.completeAuthentication, 200, token));

  } catch (err) {
    //next(err);    //Debugging
    next(new AppError(401, errorDescription.wrongCredentials, errorMessage.wrongCredentials), req, res, next);
  }
};

/**
 * Sign up new User (CREATE user)
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.signup = async (req, res, next) => {
  try {

    //Destructuring req body
    const { 
      userName, 
      fullName, 
      email, 
      description,
      gender, 
      password, 
      passwordConfirm 
    } = req.body;
    
    //Create new User
    const user = await User.create({
        userName: userName,
        fullName: fullName,
        email: email,
        description: description, 
        gender: gender,
        password: password,
        passwordConfirm: passwordConfirm,
    });

  
    if (!user) {
      return next(new AppError(404, errorDescription.unableCreate, errorMessage.unableCreate), req, res, next);      
    }

    //Generate token
    const token = createToken(user.id, user.full_name);

    //Successfully authenticated, returns JWT Token to user
    return res
            .status(200)
            .json(successAuthRes(successMessage.userSignedUpSuccess, 200, token));

  } catch (err) {
    //next(err);  //Debugging
    next(new AppError(404, errorDescription.unableCreate, errorMessage.unableCreate), req, res, next);
  }
};
