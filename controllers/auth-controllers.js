import { HttpError } from '../helpers/HttpError.js';
import { userSingUpOrIn, User, userEmailSchema } from '../models/User.js';
import { decWrap } from '../decorators/decoratorWrap.js';
import fs from 'fs/promises';
import gravatar from 'gravatar';
import bcryptjs from 'bcryptjs';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import path from 'path';
import Jimp from 'jimp';
import sendMail from '../helpers/sendEmail.js';
import { write } from 'fs';
import { nanoid } from 'nanoid';

const { JWT_SECRET, BASE_URL } = process.env;

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

	const verificationToken = nanoid();

	const newUser = User.create({
		...req.body,
		password: paswrdHash,
		avatarURL,
		verificationToken,
	});
	const verifyEmail = {
		to: email,
		subject: 'Verify',
		html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click for Verify your account</a>`,
	};

	await sendMail(verifyEmail);

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
	if (!user.verify) {
		throw HttpError(401, 'Email not verify');
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
	if (!req.file) {
		throw HttpError(400, 'missing file');
	}
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
const verification = async (req, res) => {
	const { verificationToken } = req.params;

	const user = await User.findOne({ verificationToken });

	if (!user) {
		throw HttpError(400, ' User not found');
	}
	await User.findByIdAndUpdate(user._id, {
		verify: true,
		verificationToken: '',
	});
	res.json({
		message: 'Verification successful',
	});
};
const resendEmail = async (req, res) => {
	const { error } = userEmailSchema.validate(req.body);
	if (error) {
		throw HttpError(400, error.message);
	}
	const { email } = req.body;
	const user = await User.findOne({ email });
	if (!user) {
		throw HttpError(404, 'Email not found');
	}
	if (!user.verify) {
		throw HttpError(400, 'Email  alredy verify');
	}
	const verifyEmail = {
		to: email,
		subject: 'Verify',
		html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click for Verify your account</a>`,
	};

	await sendMail(verifyEmail);
	res.json({ message: 'Verification email sent' });
};
export default {
	singup: decWrap(singUp),
	singin: decWrap(singIn),
	getCrnt: decWrap(getCurrent),
	singout: decWrap(singOut),
	updateAvatar: decWrap(updateAvtr),
	verify: decWrap(verification),
	resend: decWrap(resendEmail),
};
