import { Schema, model } from 'mongoose';
import Joi from 'joi';

const contactSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, 'Set name for contact'],
		},
		email: {
			type: String,
		},
		phone: {
			type: String,
			match: /^\d+$/,
		},
		favorite: {
			type: Boolean,
			default: false,
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: 'user',
		},
	},
	{ versionKey: false, timestamps: true }
);

contactSchema.post('save', (error, data, next) => {
	error.status = 400;
	next();
});
contactSchema.pre('findOneAndUpdate', function (next) {
	this.options.new = true;
	this.options.runValidators = true;
	next();
});
contactSchema.post('findOneAndUpdate', (error, data, next) => {
	error.status = 400;
	next();
});

export const contactsAddSchema = Joi.object({
	name: Joi.string()
		.required()
		.messages({ 'any.required': 'missing required name field' }),
	email: Joi.string()
		.email({
			minDomainSegments: 2,
			tlds: { allow: ['com', 'net'] },
		})
		.messages({ 'any.required': 'missing required email field' })
		.required(),
	phone: Joi.string()
		.length(10)
		.pattern(/^\d+$/)
		.required()
		.messages({ 'any.required': 'missing required phone field' }),

	favorite: Joi.boolean,
});

export const updateSchema = Joi.object({
	name: Joi.string(),
	email: Joi.string().email({
		minDomainSegments: 2,
		tlds: { allow: ['com', 'net'] },
	}),
	phone: Joi.string().length(10).pattern(/^\d+$/),
	favorite: Joi.boolean(),
});

export const favoriteSchema = Joi.object({
	favorite: Joi.boolean().required(),
});

export const Contact = model('contact', contactSchema);
