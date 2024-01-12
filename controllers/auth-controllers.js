import { HttpError } from '../helpers/HttpError.js';
import { userSingUpOrIn, User } from '../models/User.js';
import { decWrap } from '../decorators/decoratorWrap.js';
import fs from 'fs/promises';
import gravatar from 'gravatar';
import bcryptjs from 'bcryptjs';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import path from 'path';
import Jimp from 'jimp';
import { write } from 'fs';

const { JWT_SECRET } = process.env;

const avatarPath = path.resolve('public', 'avatars');

async function resize(p) {
	const image = await Jimp.read(p);
	image.resize(50, 50).write(avatarPath);
}

const singUp = async (req, res) => {
	const { error } = userSingUpOrIn.validate(req.body);
	if (error) {
		throw HttpError(400, error.message);
	}
	const { email, password } = req.body;
	const avatarURL = gravatar.url(email);
	const user = await User.findOne({ email });
	if (user) {
		throw HttpError(409, 'Email in use');
	}
	const paswrdHash = await bcryptjs.hash(password, 10);
	const newUser = User.create({
		...req.body,
		password: paswrdHash,
		avatarURL,
	});
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
const updateAvtr = async (req, res) => {
	const { _id } = req.user;
	const { path: oldPath, filename } = req.file;
	const specificFileName = `${_id}_${filename}`;
	const resultPath = path.join(avatarPath, specificFileName);
	await fs.rename(oldPath, resultPath);
	const avatarURL = path.join('avatars', specificFileName);
	Jimp.read(resultPath, function (err, image) {
		image.resize(250, 250).write(resultPath);
	});

	const newAvatar = await User.findByIdAndUpdate(_id, { avatarURL });
	res.json({ avatarURL });
};
export default {
	singup: decWrap(singUp),
	singin: decWrap(singIn),
	getCrnt: decWrap(getCurrent),
	singout: decWrap(singOut),
	updateAvatar: decWrap(updateAvtr),
};
