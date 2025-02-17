class AppError extends Error{
    constructor(message, errCode){
        super(message);
        this.code = errCode;
        this.isOperational = true;
        this.status = `${errCode}`.startsWith("4") ? "FAIL" : "ERROR";
        
    }
}
module.exports = AppError;


