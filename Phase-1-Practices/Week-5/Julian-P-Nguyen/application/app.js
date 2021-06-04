const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

const appRoutes = require('./routes/index');
const globalErrHandler = require('./controllers/response-models/errorResponse');
const AppError = require('./utils/appError');
const app = express();
const { errorDescription, errorMessage } = require('./utils/const');

app.use(cors());        //Allow cross-origin reqs

app.use(helmet());      // Set security HTTP headers

/* Limit request from the same API */ 
const limiter = rateLimit({
    max: 150,
    windowMs: 60 * 60 * 1000,
    message: 'Number of Requests from your IP have reached the limit !'
});

app.use('*', limiter);           //Apply traffic-limiter Middleware

/* Parse Body of Requests to JSON format */
app.use(express.json({
    limit: '15kb'
}));

app.use(mongoSanitize());   // Data sanitization against Nosql query injection

app.use(hpp());             // Prevent parameter pollution

// Routes
app.use('/api', appRoutes);

/* Handle Undefined Routes */
app.use('*', (req, res, next) => {
    const err = new AppError(404, errorDescription.undefinedRoute, errorMessage.undefinedRoute);
    next(err, req, res, next);
});

/* Error Handler */
app.use(globalErrHandler);

module.exports = app;