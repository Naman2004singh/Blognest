const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        // resolve - for the sucess, catch - for the failure
        Promise.resolve(requestHandler(req, res, next))
        .catch((err) => next(err))
    }
}

export {asyncHandler}
