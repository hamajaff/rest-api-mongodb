exports.errorMiddleware = (error, req, res, next) => {
	let customError = {
		statusCode: error.statusCode || 500,
		message: error.message || 'Something went wrong ',
	}

	if (error.name === 'CastError') {
		customError.message = `No item found with id : ${error.value}`
		customError.statusCode = 404
	}

	return res.status(customError.statusCode).json(customError)
}
