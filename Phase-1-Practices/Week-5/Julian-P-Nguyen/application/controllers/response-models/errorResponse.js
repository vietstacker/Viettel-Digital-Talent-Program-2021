// Express automatically knows that this entire function is an error handling middleware by specifying 4 parameters
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    
    res.status(err.statusCode).json({
        error: err.error,
        statusCode: err.statusCode,
        message: err.message,
        data: null
    });

};