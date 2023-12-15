import express from 'express';
import * as controllersContacts from '../../controllers/controllers-contacts.js';
import { isEmptyBody } from '../../midellwars/isEmptyBody.js';
const contactsRouter = express.Router();

contactsRouter.get('/', controllersContacts.getAll);
contactsRouter.get('/:id', controllersContacts.getById);
contactsRouter.post('/', isEmptyBody, controllersContacts.addContact);
contactsRouter.put('/:id', isEmptyBody, controllersContacts.updateContact);
contactsRouter.delete('/:id', controllersContacts.deleteContact);
export default contactsRouter;
