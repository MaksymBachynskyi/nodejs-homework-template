import express from 'express';
import { isEmptyBody } from '../../midellwars/isEmptyBody.js';
import authService from '../../controllers/auth-controllers.js';
import { authenticate } from '../../midellwars/autherization.js';
import { upload } from '../../midellwars/upload.js';

export const authRouter = express.Router();

authRouter.post('/users/register', isEmptyBody, authService.singup);
authRouter.post('/users/login', isEmptyBody, authService.singin);
authRouter.get('/users/current', authenticate, authService.getCrnt);
authRouter.post('/users/logout', authenticate, authService.singout);
authRouter.patch(
	'/users/avatars',
	authenticate,
	upload.single('avatar'),
	authService.updateAvatar
);
