export const decWrap = fn => {
	const fndec = async (req, res, next) => {
		try {
			await fn(req, res, next);
		} catch (error) {
			next(error);
		}
	};
	return fndec;
};
