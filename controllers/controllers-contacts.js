import { HttpError } from '../helpers/HttpError.js';
import * as contactsService from '../models/contacts.js';
import { contactsAddSchema, updateSchema } from '../schemas/contacts.schema.js';

export const getAll = async (req, res, next) => {
	try {
		const list = await contactsService.listContacts();
		res.status(200).json(list);
	} catch (error) {
		next(error);
	}
};
export const getById = async (req, res, next) => {
	try {
		const { id } = req.params;
		const element = await contactsService.getContactById(id);
		if (!element) {
			throw HttpError(404);
		}
		res.status(200).json(element);
	} catch (error) {
		next(error);
	}
};
export const addContact = async (req, res, next) => {
	try {
		const { error } = contactsAddSchema.validate(req.body);
		if (error) {
			throw HttpError(400, error.message);
		}
		const newContact = await contactsService.addContact(req.body);
		res.status(201).json(newContact);
	} catch (error) {
		next(error);
	}
};
export const deleteContact = async (req, res, next) => {
	try {
		const { id } = req.params;
		const element = contactsService.removeContact(id);
		if (!element) {
			throw HttpError(404);
		}
		res.status(200).json({ message: 'contact deleted' });
	} catch (error) {
		next(error);
	}
};
export const updateContact = async (req, res, next) => {
	try {
		const { error } = updateSchema.validate(req.body);
		if (error) {
			throw HttpError(400, error.message);
		}
		const { id } = req.params;
		const newContact = await contactsService.updateContact(id, req.body);
		if (!newContact) {
			throw HttpError(404);
		}
		res.status(200).json(newContact);
	} catch (error) {
		next(error);
	}
};
