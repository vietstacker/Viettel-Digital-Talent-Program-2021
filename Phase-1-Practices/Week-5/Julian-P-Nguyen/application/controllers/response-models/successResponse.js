/**
 * Model for Success Message
 * @param {*} message 
 * @param {*} statusCode 
 * @param {*} data 
 * @returns 
 */
exports.successRes = (message, statusCode, data) => {
    return {
        message,
        error: null,
        status_code: parseInt(statusCode),
        data
    };
}


/**
 *  Model for Successful Auth Response
 * 
 * @param {*} message 
 * @param {*} statusCode 
 * @param {*} token 
 * @returns 
 */
exports.successAuthRes = (message, statusCode, token) => {
    return {
        message,
        error: null,
        status_code: parseInt(statusCode),
        token
    };
}