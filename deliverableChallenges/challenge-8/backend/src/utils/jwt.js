import 'dotenv/config';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const generateToken = user => {
	const token = jwt.sign({ user }, config.jwtSecret, { expiresIn: '12h' });

	return token;
};

export const authToken = (req, res, next) => {
	const authHeader = req.cookies.jwtCookie;

	if (!authHeader) {
		return res.status(401).send({ error: 'Usuario no autenticado' });
	}

	const token = authHeader.split(' ')[1];
	jwt.sign(token, config.jwtSecret, (error, credentials) => {
		if (error) {
			return res.status(403).send({ error: 'Usuario no autorizado' });
		}
		req.user = credentials.user;

		next();
	});
};
