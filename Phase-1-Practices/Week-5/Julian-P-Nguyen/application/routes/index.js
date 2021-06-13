const express = require('express');
const router = express.Router();

const boardRouter = require('./boardRoutes');
const userRouter = require('./userRoutes');
const taskRouter = require('./taskRoutes');
const authRouter = require('./authRoutes');
const requireAuth = require('../middlewares/require-auth');

//Requires JWT to access these APIs
router.use(['/boards', '/tasks', '/users'], requireAuth);

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/boards', boardRouter);
router.use('/tasks', taskRouter);

module.exports = router;