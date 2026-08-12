// to provide the genralize error response
// node js provide us the "Error" class to do so 

class ApiError extends Error{
    constructor(    // this is defining
        statusCode,
        message = "Something went wrong",
        errors = [], // to give the multiple errors
        stack = ''
    ){
        // to ovveride the constuctor
        super(message), // compulsory
        this.statusCode = statusCode,
        this.data = null,
        this.message = message,
        this.sucess = false,
        this.errors = errors

        // This stores the stack trace, showing where the error occurred.
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export {ApiError}