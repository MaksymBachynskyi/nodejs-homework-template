import { HttpError } from '../helpers/HttpError.js';
import * as contactsService from '../models/contacts.js';
export const getAll = async (req, res, next) => {
	try {
		const list = await contactsService.listContacts();
		res.json(list);
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
		res.json(element);
	} catch (error) {
		next(error);
	}
};
export const addContact = async (req, res, next) => {
	try {
		console.log(req.body);
		// const newContact = await contactsService.addContact();
		// res.json(newContact);
	} catch (error) {
		next(error);
	}
};
