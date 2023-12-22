import express from 'express';
import controllersContacts from '../../controllers/controllers-contacts.js';
import { isEmptyBody } from '../../midellwars/isEmptyBody.js';
import { isValidId } from '../../midellwars/isValidId.js';

const contactsRouter = express.Router();

contactsRouter.get('/', controllersContacts.geAllContacts);
contactsRouter.get('/:id', isValidId, controllersContacts.getContactById);
contactsRouter.post('/', isEmptyBody, controllersContacts.createContact);
contactsRouter.put(
	'/:id',
	isValidId,
	isEmptyBody,
	controllersContacts.updateOneContact
);
contactsRouter.patch(
	'/:id/favorite',
	isValidId,
	isEmptyBody,
	controllersContacts.updateStatus
);
contactsRouter.delete('/:id', isValidId, controllersContacts.deleteOneContact);
export default contactsRouter;
