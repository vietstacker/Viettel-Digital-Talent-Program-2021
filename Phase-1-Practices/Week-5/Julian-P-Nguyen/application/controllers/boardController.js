const Board = require('../models/boardModel');
const { successRes } = require('./response-models/successResponse');
const AppError = require("../utils/appError");
const { errorDescription, errorMessage, successMessage } =  require('../utils/const');

/**
 *  Delete A Board
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.deleteBoard = async (req, res, next) => {
    try {
        const deleteBoard = await Board.findByIdAndDelete(req.params.id);

        if (!deleteBoard) {
            return next(new AppError(404, errorDescription.unableDelete, errorMessage.unableDelete), req, res, next);
        }

        res
            .status(200)
            .json(successRes(successMessage.boardDeleted, 200, { id: deleteBoard.id }));
    
    } catch (error) {
        next(error);
    }
};

/**
 *  Update Board info
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.updateBoard = async (req, res, next) => {
    try {

        const updateBoard = await Board.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!updateBoard) {
            return next(new AppError(404, errorDescription.unableUpdate, errorMessage.unableUpdate), req, res, next);
        }

        res
            .status(200)
            .json(successRes(successMessage.boardUpdated, 200, { id: updateBoard.id }));

    } catch (error) {
        next(error);
        //next(new AppError(404, errorDescription.unableUpdate, errorMessage.unableUpdate), req, res, next);
    }
};

/**
 *  Create a new Board
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.createBoard = async (req, res, next) => {
    try {
        //Creating board
        const createBoard = await Board.create({
            title: req.body.title,
            description: req.body.description,
            ownerId: req.user.id
        });

        if (!createBoard) {
            return next(new AppError(404, errorDescription.unableCreate, errorMessage.unableCreate), req, res, next);
        }

        res
            .status(200)
            .json(successRes(successMessage.boardCreated, 200, { id: createBoard.id }));

    } catch (error) {
        next(error);
        //next(new AppError(404, errorDescription.unableCreate, errorMessage.unableCreate), req, res, next);
    }
};

/**
 *  Get a Board specified by Id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.getSingleBoard = async (req, res, next) => {
    try {

        //Search by id
        const searchBoard = await Board.findById(req.params.id);

        if (!searchBoard) {
            return next(new AppError(404, errorDescription.notFound, errorMessage.notFound), req, res, next);
        }

        res
            .status(200)
            .json(successRes(successMessage.boardFound, 200, { 
                id: searchBoard.id,
                title: searchBoard.title,
                description: searchBoard.description,
                taskCollection: searchBoard.taskCollection,
                createdAt: searchBoard.createdAt,
                updatedAt: searchBoard.updatedAt
            }));

    } catch (error) {
        next(error);
        //next(new AppError(404, errorDescription.notFound, errorMessage.notFound), req, res, next);
    }
};

/**
 *  Get List of Boards
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.getBoardList = async (req, res, next) => {
    try {
        
        const boardList = await Board
                                    .find({ ownerId: req.user.id })
                                    .select('title')
                                    .select('description')
                                    .select('taskCollection')
                                    .select('ownerId')
                                    .select('createdAt')
                                    .select('updatedAt');

        if (!boardList)
            return next(new AppError(404, errorDescription.notFound, errorMessage.notFound), req, res, next);

        res
            .status(200)
            .json(successRes(successMessage.boardListFound, 200, boardList));

    } catch (error) {
        next(error);
        //next(new AppError(404, errorDescription.notFound, errorMessage.notFound), req, res, next);
    }

};
