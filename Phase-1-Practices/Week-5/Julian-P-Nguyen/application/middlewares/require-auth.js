const jwt = require("jsonwebtoken");
const User = require('../models/userModel');
const AppError = require("../utils/appError");
const { errorDescription, errorMessage, successMessage } =  require('../utils/const');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({
    path: './config.env'
});

//Signing str from .env file
const signingString = process.env.JWT_STRING

/**
 *  Middleware Checking for Authentication Status
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
let requireAuth = (req, res, next) => {
    
    //Retrieve the Authorization from header
    const { authorization } = req.headers;

    if (!authorization) {
        return next(new AppError(401, errorDescription.notAuthenticated, errorMessage.notAuthenticated), req, res, next);
    }

    //Retrieve token
    const retrievedToken = authorization.replace('Bearer', '');

    //Validate token
    jwt.verify(retrievedToken, signingString , async(error, payload) => {
        //Invalid token
        if (error)
            return next(new AppError(404, errorDescription.notAuthenticated, errorMessage.notAuthenticated), req, res, next);
        
        //Get data by decryped token
        const { id } = payload;

        //Invalid Object Id
        if (!mongoose.Types.ObjectId.isValid(id))
            return next(new AppError(404, errorDescription.notAuthenticated, errorMessage.notAuthenticated), req, res, next);

        //Find user
        const validUser = await User.findById(id);

        //Attach user Object to request
        req.user = {
            id: validUser.id,
            userName: validUser.userName,
        };
        
        next();
    }); 
    
}

module.exports = requireAuth;
