import mongoose from 'mongoose';
import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();
const { DB_HOST, PORT = 3000 } = process.env;
mongoose
	.connect(DB_HOST)
	.then(() => {
		app.listen(3000, () => {
			console.log('Database connection successful');
		});
	})
	.catch(error => {
		console.log(error);
		process.exit(1);
	});
