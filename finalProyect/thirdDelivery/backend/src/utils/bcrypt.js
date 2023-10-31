import bcrypt from 'bcrypt';
import config from '../config/config.js';

export const createHash = password =>
	bcrypt.hashSync(password, bcrypt.genSaltSync(parseInt(config.salt)));

export const validatePassword = (passwordSended, passwordBBDD) =>
	bcrypt.compareSync(passwordSended, passwordBBDD);
