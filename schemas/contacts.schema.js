import Joi from 'joi';
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
});
export const updateSchema = Joi.object({
	name: Joi.string(),
	email: Joi.string().email({
		minDomainSegments: 2,
		tlds: { allow: ['com', 'net'] },
	}),
	phone: Joi.string().length(10).pattern(/^\d+$/),
});
