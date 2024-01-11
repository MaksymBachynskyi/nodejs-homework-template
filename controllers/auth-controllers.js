import { HttpError } from '../helpers/HttpError.js';
import { userSingUpOrIn, User } from '../models/User.js';
import { decWrap } from '../decorators/decoratorWrap.js';
import bcryptjs from 'bcryptjs';
import 'dotenv/config';
import jwt from 'jsonwebtoken';

const { JWT_SECRET } = process.env;

const singUp = async (req, res) => {
	const { error } = userSingUpOrIn.validate(req.body);
	if (error) {
		throw HttpError(400, error.message);
	}
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (user) {
		console.log(user);
		throw HttpError(409, 'Email in use');
	}
	const paswrdHash = await bcryptjs.hash(password, 10);
	const newUser = User.create({ ...req.body, password: paswrdHash });
	res.status(201).json({
		user: {
			email,
			subscription: 'starter',
		},
	});
};

const singIn = async (req, res) => {
	const { error } = userSingUpOrIn.validate(req.body);
	if (error) {
		throw HttpError(400, error.message);
	}
	const { email, password } = req.body;

	const user = await User.findOne({ email });
	if (!user) {
		throw HttpError(401, 'Email or password is wrong');
	}
	const passwordCmpr = await bcryptjs.compare(password, user.password);

	if (!passwordCmpr) {
		throw HttpError(401, 'Email or password is wrong');
	}

	const payload = { id: user._id };

	const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '23h' });
	await User.findByIdAndUpdate(user._id, { token });
	res.json({
		token,
		user: {
			email,
			subscription: user.subscription,
		},
	});
};
const getCurrent = async (req, res) => {
	const { email, subscription } = req.user;
	res.json({
		email,
		subscription,
	});
};
const singOut = async (req, res) => {
	const { _id } = req.user;
	await User.findByIdAndUpdate(_id, { token: '' });
	res.status(204).json({ message: 'No Content' });
};
export default {
	singup: decWrap(singUp),
	singin: decWrap(singIn),
	getCrnt: decWrap(getCurrent),
	singout: decWrap(singOut),
};
