import { generateToken } from '../utils/jwt.js';

const postSession = async (req, res) => {
	try {
		if (!req.user) {
			return res.status(401).send({ mensaje: 'Invalidate user' });
		}

		const token = generateToken(req.user);
		res.cookie('jwtCookie', token, {
			maxAge: 43200000,
		});

		return res.redirect('../../static/products');
	} catch (error) {
		res.status(500).send({ mensaje: `Error al iniciar sesión ${error}` });
	}
};

const getCurrentSession = async (req, res) => {
	res.status(200).send(req.user);
};

const getGithubCreateUser = async (req, res) => {
	return res.status(200).send({ mensaje: 'Usuario creado' });
};

const getGithubSession = async (req, res) => {
	req.session.user = req.user;
	res.status(200).send({ mensaje: 'Sesión creada' });
};

const getLogout = (req, res) => {
	if (req.session) {
		req.session.destroy();
	}
	res.clearCookie('jwtCookie');
	res.status(200).send({ resultado: 'Login eliminado', message: 'Logout' });
};

const sessionController = {
	postSession,
	getCurrentSession,
	getGithubCreateUser,
	getGithubSession,
	getLogout,
};

export default sessionController;
