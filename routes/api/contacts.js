import express from 'express';
import * as controllersContacts from '../../controllers/controllers-contacts.js';
const contactsRouter = express.Router();

contactsRouter.get('/', controllersContacts.getAll);
contactsRouter.get('/:id', controllersContacts.getById);
contactsRouter.post('/', controllersContacts.addContact);

export default contactsRouter;
