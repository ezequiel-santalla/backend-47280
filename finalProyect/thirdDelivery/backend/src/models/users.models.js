import { Schema, model } from 'mongoose';
import cartModel from './carts.models.js';

const userSchemna = new Schema({
	role: {
		type: String,
		default: 'user',
	},

	first_name: {
		type: String,
		required: true,
	},

	last_name: {
		type: String,
		required: true,
	},

	email: {
		type: String,
		required: true,
		unique: true,
	},

	password: {
		type: String,
		required: true,
	},

	age: {
		type: Number,
		required: true,
	},

	cart: {
		type: Schema.Types.ObjectId,
		ref: 'carts',
	},
});

userSchemna.pre('save', async function (next) {
	try {
		const newCart = await cartModel.create({});

		this.cart = newCart._id;
	} catch (error) {
		next(error);
	}
});

const userModel = model('users', userSchemna);

export default userModel;
