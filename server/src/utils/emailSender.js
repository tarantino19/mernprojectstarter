import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

console.log('Auth Email:', process.env.AUTH_EMAIL);
console.log('Auth Password:', process.env.AUTH_PASS ? '****' : 'Not set'); // Don't log the actual password

const transporter = nodemailer.createTransport({
	host: 'smtp-mail.outlook.com',
	port: 587,
	secure: false,
	auth: {
		user: process.env.AUTH_EMAIL,
		pass: process.env.AUTH_PASS,
	},
});

transporter.verify((error, success) => {
	if (error) {
		console.error('SMTP Configuration Error:', error);
	} else {
		console.log('Server is ready to take our messages');
	}
});

const sendEmail = async (mailOptions) => {
	try {
		await transporter.sendMail(mailOptions);
		console.log('Email sent successfully');
	} catch (error) {
		console.error('Error sending email:', error);
	}
};

export default sendEmail;
