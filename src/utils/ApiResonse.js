// for the response express or node does not provide any specific class like the Error
// so we can custom create our own

class ApiResponse {
    constructor(
        statusCode,
        data,
        message = "success"
    ){
        this.statusCode = statusCode,
        this.data = data,
        this.message = message,
        this.success = statusCode < 400     // as it is the sucess response
    }
}

export { ApiResponse }