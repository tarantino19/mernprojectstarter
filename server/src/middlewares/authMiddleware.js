//auth middlewares

const isAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	return res.status(401).json({ error: 'Unauthorized. Please log in.' });
};

const isAdmin = (req, res, next) => {
	if (req.isAuthenticated() && req.user.isAdmin) {
		return next();
	}
	return res.status(403).json({ error: 'Forbidden. Admin access required.' });
};

export { isAuthenticated, isAdmin };
