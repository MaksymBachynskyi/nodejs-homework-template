import { log } from 'console';
import multer from 'multer';
import path from 'path';

const destination = path.resolve('tmp');

const storage = multer.diskStorage({
	destination,
	filename: (req, file, cb) => {
		const uniqPrefx = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
		const filename = `${uniqPrefx}_${file.originalname}`;
		cb(null, filename);
	},
});

const limits = {
	filesize: 1024 * 1024 * 5,
};

export const upload = multer({
	storage,
	limits,
});
