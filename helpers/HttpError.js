const messageLIst = {
	400: 'Bad Request',
	401: 'Unathorizated',
	403: 'Forbidden',
	404: 'Not Found',
	409: 'Conflict',
};
export const HttpError = (status, message = messageLIst[status]) => {
	const error = new Error(message);
	error.status = status;
	return error;
};
