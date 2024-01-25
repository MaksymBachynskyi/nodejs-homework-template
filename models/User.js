import { Schema, model } from 'mongoose';
import Joi from 'joi';

const userSchema = new Schema(
	{
		password: {
			type: String,
			required: [true, 'Set password for user'],
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: true,
		},
		subscription: {
			type: String,
			enum: ['starter', 'pro', 'business'],
			default: 'starter',
		},
		token: String,
		avatarURL: {
			type: String,
			required: true,
		},
		verify: {
			type: Boolean,
			default: false,
		},
		verificationToken: {
			type: String,
			// required: [true, 'Verify token is required'],
		},
	},
	{ versionKey: false, timestamps: true }
);

export const userSingUpOrIn = Joi.object({
	email: Joi.string()
		.email({
			minDomainSegments: 2,
			tlds: { allow: ['com', 'net'] },
		})
		.messages({ 'any.required': 'missing required email field' })
		.required(),
	password: Joi.string().required().min(4),
});

export const userEmailSchema = Joi.object({
	email: Joi.string()
		.email({
			minDomainSegments: 2,
			tlds: { allow: ['com', 'net'] },
		})
		.messages({ 'any.required': 'missing required email field' })
		.required(),
});
userSchema.post('save', (error, data, next) => {
	error.status = 400;
	next();
});
userSchema.pre('findOneAndUpdate', function (next) {
	this.options.new = true;
	this.options.runValidators = true;
	next();
});
userSchema.post('findOneAndUpdate', (error, data, next) => {
	error.status = 400;
	next();
});

export const User = model('user', userSchema);
