import express from 'express';
import { isEmptyBody } from '../../midellwars/isEmptyBody.js';
import authService from '../../controllers/auth-controllers.js';
import { authenticate } from '../../midellwars/autherization.js';
import { upload } from '../../midellwars/upload.js';

export const authRouter = express.Router();

authRouter.post('/register', isEmptyBody, authService.singup);
authRouter.get('/verify/:verificationToken', authService.verify);
authRouter.post('/verify', isEmptyBody, authService.resend);
authRouter.post('/login', isEmptyBody, authService.singin);
authRouter.get('/current', authenticate, authService.getCrnt);
authRouter.post('/logout', authenticate, authService.singout);
authRouter.patch(
	'/avatars',
	authenticate,
	upload.single('avatar'),
	authService.updateAvatar
);
