const AppError = require("../utils/AppError")
const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = error => {
    const fieldName = Object.keys(error.keyValue)[0];
    const value = error.keyValue[fieldName];
    const message = `The ${fieldName} ${value} has already been taken!`
    return new AppError(message, 400)
}

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);

    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};


const handleJWTError = () =>
    new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
    new AppError('Your token has expired! Please log in again.', 401);


const sendError = (err, req, res)=>{
        
        if (err.isOperational) {
          return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
          });
        }
        // if programming error send a generic error!
        console.error('ERROR', err);
        return res.status(500).json({
          status: 'error',
          message: 'Something went very wrong!'
        });
}


module.exports = (err, req, res, next) => {
    // console.log(err.stack);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';


    let error = {
        ...err
    };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
        error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendError(error, req, res);

};