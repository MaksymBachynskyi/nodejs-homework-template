import path from 'path';
import * as fs from 'fs/promises';
import { nanoid } from 'nanoid';

const p = path.resolve('models', 'contacts.json');

export const listContacts = async () => {
	const data = await fs.readFile(p);
	return JSON.parse(data);
};
export const addContact = async ({ name, email, phone }) => {
	const data = { id: nanoid(), name, email, phone };
	const allData = await listContacts();
	allData.push(data);
	fs.writeFile(p, JSON.stringify(allData, null, 2));
	return data;
};
export const getContactById = async id => {
	const data = await listContacts();
	const oneItem = data.findIndex(item => item.id === id);
	if (oneItem === -1) {
		return null;
	}
	return data[oneItem];
};
export const removeContact = async id => {
	const data = await listContacts();
	const indexElement = data.findIndex(item => item.id === id);
	if (indexElement === -1) {
		return null;
	}
	const [result] = data.splice(indexElement, 1);
	fs.writeFile(p, JSON.stringify(data, null, 2));
	return result;
};
