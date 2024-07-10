const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
	host: process.env.MAIL_HOST,
	port: process.env.MAIL_PORT,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASSWORD,
	},
});

const sendEmail = async ({ email, foundedIndex }) => {
	try {
		let info = await transporter.sendMail({
			from: 'no-reply@example.com',
			to: email,
			subject: 'Price Alert',
			text: `Price of ${foundedIndex.name} has been changed. Current price: ${foundedIndex.price}`,
		});
		console.log('Email sent:', info.response);
	} catch (error) {
		console.error('Error sending email:', error);
	}
};

module.exports = { sendEmail };
