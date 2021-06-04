const User = require('../models/userModel');
const { successRes } = require('./response-models/successResponse');
const AppError = require("../utils/appError");
const { errorDescription, errorMessage, successMessage } =  require('../utils/const');

/**
 *  Get A single User base on Id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.getUser = async (req, res, next) => {
    try {
        
        //Retrieve user from db
        const searchUser = await User.findById(req.params.id);      
      
        //User not Found
        if (!searchUser) {
            return next(new AppError(404, errorDescription.notFound, errorMessage.notFound), req, res, next);
        }

        res
            .status(200)
            .json(successRes(successMessage.userFound, 200, 
            {
                id: searchUser.id,
                userName: searchUser.userName, 
                fullName: searchUser.fullName, 
                email: searchUser.email, 
                description: searchUser.description,
                gender: searchUser.gender, 
                created_at: searchUser.createdAt,
                updated_at: searchUser.updatedAt
            })
        );

    } catch(err) {
        //next(err);              //Debugging
        next(new AppError(404, errorDescription.notFound, errorMessage.notFound), req, res, next);
    }
};

/**
 *  Delete User
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.deleteUser = async (req, res, next) => {
    try {
    
        const deleteUser = await User.findByIdAndDelete(req.params.id);

        if (!deleteUser) {
            return next(new AppError(404, errorDescription.unableDelete, errorMessage.unableDelete), req, res, next);
        }

        res
            .status(200)
            .json(successRes(successMessage.userDeleted, 200, { id: deleteUser.id }));

    } catch (error) {
        next(error);
    }
};

/**
 *  Update User Info
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.updateUser = async (req, res, next) => {
    try {
        
        const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        
        if (!updateUser) {
            return next(new AppError(404, errorDescription.unableUpdate, errorMessage.unableUpdate), req, res, next);
        }

        res
            .status(200)
            .json(successRes(successMessage.userUpdated, 200, { id: updateUser.id }));

    } catch (error) {
        next(error);
    }
};