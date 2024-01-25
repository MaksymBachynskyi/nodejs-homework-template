import nodemailer from 'nodemailer';
import 'dotenv/config';

const { EMAIL_FROM, PASS_UKRNET } = process.env;

const nodemailerConfig = {
	host: 'smtp.ukr.net',
	port: 465,
	secure: true,
	auth: {
		user: EMAIL_FROM,
		pass: PASS_UKRNET,
	},
};

const transport = nodemailer.createTransport(nodemailerConfig);

// const email = {
// 	from: EMAIL_FROM,
// 	to: 'tiferab377@rentaen.com',
// 	subject: 'hello',
// 	html: '<h1>Hello</h1>',
// };
const sendMail = data => {
	const email = { ...data, from: EMAIL_FROM };
	return transport.sendMail(email);
};

export default sendMail;
