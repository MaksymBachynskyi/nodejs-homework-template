import { HttpError } from '../helpers/HttpError.js';

import { Contact } from '../models/Contacts.js';
import {
	contactsAddSchema,
	updateSchema,
	favoriteSchema,
} from '../models/Contacts.js';
import { decWrap } from '../decorators/decoratorWrap.js';
import { populate } from 'dotenv';

const getAll = async (req, res) => {
	const { _id: owner } = req.user;
	const { page = 2, limit = 20 } = req.query;
	const skip = (page - 1) * limit;
	const result = await Contact.find({ owner }, { skip, limit }).populate(
		'owner'
	);
	console.log(result);
	res.status(200).json(result);
};

const getById = async (req, res) => {
	const { id } = req.params;
	const element = await Contact.findById(id);

	if (!element) {
		throw HttpError(404);
	}
	res.status(200).json(element);
};

const addContact = async (req, res) => {
	const { _id } = req.user;
	const { error } = contactsAddSchema.validate(req.body);
	if (error) {
		throw HttpError(400, error.message);
	}
	const newContact = await Contact.create({ ...req.body, owner: _id });
	res.status(201).json(newContact);
};

const deleteContact = async (req, res) => {
	const { id } = req.params;
	const element = await Contact.findByIdAndDelete(id);
	if (!element) {
		throw HttpError(404);
	}
	res.status(200).json({ message: 'contact deleted' });
};

const updateFavoriteStatus = async (req, res) => {
	const { error } = favoriteSchema.validate(req.body);
	if (error) {
		throw HttpError(400, error.message);
	}
	const { id } = req.params;
	const newContact = await Contact.findByIdAndUpdate(id, req.body);
	if (!newContact) {
		throw HttpError(404);
	}
	res.status(200).json(newContact);
};

const updateContact = async (req, res) => {
	const { error } = updateSchema.validate(req.body);
	if (error) {
		throw HttpError(400, error.message);
	}
	const { id } = req.params;
	const newContact = await Contact.findByIdAndUpdate(id, req.body);
	if (!newContact) {
		throw HttpError(404);
	}
	res.status(200).json(newContact);
};
export default {
	geAllContacts: decWrap(getAll),
	getContactById: decWrap(getById),
	createContact: decWrap(addContact),
	updateOneContact: decWrap(updateContact),
	deleteOneContact: decWrap(deleteContact),
	updateStatus: decWrap(updateFavoriteStatus),
};
