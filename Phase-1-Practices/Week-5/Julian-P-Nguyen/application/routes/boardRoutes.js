const express = require('express');
const boardRouter = express.Router();

const { getBoardList, getSingleBoard, createBoard, updateBoard, deleteBoard }  = require('../controllers/boardController');

/**
 * Routes handling Board related operations
 */

boardRouter.get('/list', getBoardList);
boardRouter.get('/:id', getSingleBoard);
boardRouter.post('/create', createBoard);
boardRouter.patch('/update/:id', updateBoard);
boardRouter.delete('/delete/:id', deleteBoard);

module.exports = boardRouter;