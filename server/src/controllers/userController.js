import User from '../models/userSchema.js';
import { hashPassword, comparePassword } from '../utils/helpers.js';
import bcrypt from 'bcrypt';
import PDFDocument from 'pdfkit';
import axios from 'axios';
import Otp from '../models/otpSchema.js';
import sendEmail from '../utils/emailSender.js';
import { hashOTP } from '../utils/helpers.js';

//***AUTH***

const createUser = async (req, res) => {
	try {
		const { username, password, email, isAdmin } = req.body;

		// Check for required fields
		if (!username || !password || !email) {
			return res.status(400).json({ error: 'Username, email, and password are required' });
		}

		// Check if password meets length requirement
		if (password.length < 6) {
			return res.status(400).json({ error: 'Password must be at least 6 characters' });
		}

		// Check for existing username
		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(401).json({ error: 'Username already exists' });
		}

		// Check for existing email
		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			return res.status(401).json({ error: 'Email already registered' });
		}

		// Hash the password
		const hashedPassword = await hashPassword(password);

		// Create a new user
		const newUser = new User({
			username,
			email,
			password: hashedPassword,
			isAdmin: isAdmin || false,
			isEmailVerified: false,
		});

		// Save the user
		await newUser.save();

		// Send the OTP
		await sendUserOTP(email);

		res.status(201).json({ message: 'User created successfully, please verify your email to login', user: newUser });
	} catch (error) {
		console.error('Error creating user:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

// Function to send OTP
const sendUserOTP = async (email) => {
	try {
		const generatedOTP = String(Math.floor(1000 + Math.random() * 9000));

		const mailOptions = {
			from: process.env.AUTH_EMAIL,
			to: email,
			subject: 'Your One Time Password',
			html: `
				<h1>Email Verification</h1>
				<p style="font-size: 24px; font-weight: bold; color: red;">${generatedOTP}</p>
				<p>This code will expire within 30 days. If not verified, your account will be deleted, and you will need to register again.</p>
			`,
		};

		// Send the email
		await sendEmail(mailOptions);

		const hashedOTP = await hashOTP(generatedOTP);

		const newOTP = new Otp({
			email,
			otp: hashedOTP,
			createdAt: Date.now(),
			expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
		});

		// Save the OTP
		await newOTP.save();

		// Return a success message
		return { status: 'success', message: 'OTP sent to your email' };
	} catch (error) {
		console.error(error);
		throw new Error('Failed to send OTP');
	}
};

const sendUserOTPforPassword = async (email) => {
	try {
		const generatedOTP = String(Math.floor(1000 + Math.random() * 9000));

		const mailOptions = {
			from: process.env.AUTH_EMAIL,
			to: email,
			subject: 'Your One Time Password',
			html: `
				<h1>Password Reset Code</h1>
				<p style="font-size: 24px; font-weight: bold; color: red;">${generatedOTP}</p>
				<p>This code will expire within 30 minutes!</p>
			`,
		};

		// Send the email
		await sendEmail(mailOptions);

		const hashedOTP = await hashOTP(generatedOTP);
		const newOTP = new Otp({
			email,
			otp: hashedOTP,
			createdAt: Date.now(),
			expiresAt: Date.now() + 30 * 60 * 1000, // 30 minutes expiration
		});

		// Save the OTP
		await newOTP.save(); // Save the instance

		// Respond with success message if needed
		return { status: 'success', message: 'OTP sent to your email' }; // Return the response
	} catch (error) {
		console.error(error);
		throw new Error('Failed to send OTP');
	}
};

const verifyUserOTP = async (req, res) => {
	const { email, otp } = req.body;

	if (!email || !otp) {
		return res.status(400).json({ error: 'Email and OTP are required' });
	}

	try {
		const existingOTP = await Otp.findOne({ email });

		if (!existingOTP) {
			return res.status(404).json({ error: 'OTP not found for this email' });
		}

		const { expiresAt } = existingOTP;

		// Check if OTP is expired
		if (expiresAt < Date.now()) {
			await Otp.deleteOne({ email });
			return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
		}

		// Verify the OTP
		const isValidOTP = await bcrypt.compare(otp, existingOTP.otp);

		if (!isValidOTP) {
			return res.status(400).json({ error: 'Invalid OTP. Please try again.' });
		}

		// Update user verification status
		await User.updateOne({ email }, { isEmailVerified: true });

		// Optionally, delete the OTP after successful verification
		await Otp.deleteOne({ email });

		res.status(200).json({ message: 'OTP verified successfully, email verified!', authenticated: true });
	} catch (error) {
		console.error('Error verifying OTP:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

const forgotPasswordRequest = async (req, res) => {
	const { email } = req.body;

	if (!email) {
		return res.status(400).json({ error: 'Email is required' });
	}

	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ error: { message: 'User not found' } });
		}

		if (!user.isEmailVerified) {
			return res.status(400).json({ error: { message: 'Email not verified' } });
		}

		// Send the OTP
		await sendUserOTPforPassword(email);

		res.status(200).json({ message: 'OTP sent successfully' });
	} catch (error) {
		console.error('Error sending OTP:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

const changePassword = async (req, res) => {
	try {
		const { email, otp, newPassword, confirmNewPassword } = req.body;

		if (!email || !otp || !newPassword || !confirmNewPassword) {
			return res.status(400).json({ error: 'All fields are required' });
		}

		if (newPassword !== confirmNewPassword) {
			return res.status(400).json({ error: 'Passwords do not match' });
		}

		const otpRecord = await Otp.findOne({ email });
		if (!otpRecord) {
			return res.status(400).json({ error: 'This email has no OTP record' });
		}

		if (otpRecord.expiresAt < Date.now()) {
			await Otp.deleteOne({ email });
			return res.status(400).json({ error: 'OTP has expired' });
		}

		const isOtpValid = await bcrypt.compare(otp.trim(), otpRecord.otp);
		console.log('isOtpValid', isOtpValid);

		if (!isOtpValid) {
			return res.status(400).json({ error: 'Invalid OTP' });
		}

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(newPassword, salt);
		user.password = hashedPassword;
		await user.save();

		await Otp.deleteOne({ email }); // Delete OTP only if validation passed
		res.status(200).json({ message: 'Password changed successfully' });
	} catch (error) {
		console.error('Error changing password:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

const loginUser = async (req, res) => {
	const { username, password } = req.body;

	const user = await User.findOne({ username });
	if (!user) {
		return res.status(401).json({ error: 'Invalid username or password' });
	}

	if (!user.isEmailVerified) {
		return res.status(403).json({ error: 'Email not verified. Please verify your email before logging in.' });
	}

	const match = await comparePassword(password, user.password);
	if (!match) {
		return res.status(401).json({ error: 'Invalid username or password' });
	}

	req.login(user, (error) => {
		if (error) {
			return next(error);
		}
		console.log('reqSession', req.session);
		console.log('reqUser', req.user);
	});

	console.log('You are now logged in..');
	res
		.status(200)
		.json({ status: 'success', authenticated: true, message: 'You are now logged in. User is now authenticated' });
};

const checkAuthStatus = async (req, res) => {
	if (req.isAuthenticated()) {
		return res.status(200).json({ authenticated: true });
	} else {
		return res.status(401).json({ authenticated: false });
	}
};

const logout = (req, res, next) => {
	if (!req.isAuthenticated()) {
		return res.status(401).json({ error: 'Unauthorized. You are not logged in yet' });
	}

	req.logout((error) => {
		if (error) {
			console.error('Logout error:', error);
			return next(error);
		}
		res.clearCookie('connect.sid', { path: '/' });

		// Optionally, destroy the session data
		req.session.destroy((err) => {
			if (err) {
				console.error('Session destroy error:', err);
				return next(err);
			}

			console.log('You are now logged out..');
			res.status(200).json({ message: 'Logout successful' });
		});
	});
};

//***AUTH***

//***USERS***

const getUsers = async (req, res) => {
	try {
		const users = await User.find();

		if (!users) {
			return res.status(404).json({ error: 'No users found' });
		}

		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const getSingleUser = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id).select('-password');
		if (!user) {
			res.status(404).json({ error: 'User not found' });
		} else {
			res.status(200).json(user);
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const getCurrentUserProfile = async (req, res) => {
	console.log('req.user:', req.user);
	const user = await User.findById(req.user._id).select('-password');

	try {
		if (user) {
			res.status(200).json(user);
		} else {
			res.status(404);
			throw new Error('User info not found');
		}
	} catch (error) {
		res.status(404).json({ message: 'User not found' });
	}
};

const updateCurrentUserProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);

		//check if username exist in the db
		const usernameExists = await User.findOne({ username: req.body.username });
		if (usernameExists && usernameExists._id.toString() !== user._id.toString()) {
			return res.status(400).json({ error: 'Username already exists' });
		}

		if (user) {
			user.username = req.body.username || user.username;

			if (req.body.password) {
				const salt = await bcrypt.genSalt(11);
				const hashedPassword = await bcrypt.hash(req.body.password, salt);
				user.password = hashedPassword;
			}

			await user.save();

			res.status(200).json({ message: 'User updated successfully' });
		} else {
			res.status(404);
			throw new Error('User not found');
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const deleteUser = async (req, res) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id);
		if (user) {
			res.status(200).json({ message: 'User deleted successfully' });
		} else {
			res.status(404);
			throw new Error('User not found');
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

//***USERS***

//***USER SEARCH ***

const searchUsers = async (req, res) => {
	const { username, email, isAdmin } = req.query;

	const query = {};

	if (username) {
		query.username = { $regex: new RegExp(username, 'i') };
	}
	if (email) {
		query.email = { $regex: new RegExp(email, 'i') };
	}
	if (isAdmin !== undefined) {
		query.isAdmin = isAdmin === 'true';
	}

	const users = await User.find(query).select('-password');

	if (users.length === 0) {
		return res.status(404).json({
			success: false,
			message: 'No users found matching the search criteria.',
		});
	}

	res.json({
		success: true,
		users,
	});
};

//***GENERATE REPORT***

const generateReport = async (req, res) => {
	try {
		// Prepare query parameters
		const queryParams = Object.keys(req.query).length ? req.query : {};

		// Fetch data from the searchUsers endpoint
		const { data } = await axios.get('http://localhost:4000/userApi/users/search', {
			params: queryParams,
			headers: {
				Cookie: req.headers.cookie,
				Authorization: req.headers.authorization,
			},
		});

		const doc = new PDFDocument();

		// Set headers to send PDF as an attachment
		res.setHeader('Content-disposition', 'attachment; filename=report.pdf');
		res.setHeader('Content-type', 'application/pdf');
		doc.pipe(res);

		// Add title
		doc.fontSize(18).text(`User Report ${new Date()}`, { align: 'center' });
		doc.moveDown();

		// Add data to PDF
		if (data.users && data.users.length > 0) {
			data.users.forEach((user) => {
				doc.fontSize(12).text(`Username: ${user.username}`, { align: 'left' });
				doc.text(`Email: ${user.email}`);
				doc.text(`Admin: ${user.isAdmin ? 'Yes' : 'No'}`);
				doc.moveDown();
			});
		} else {
			doc.fontSize(12).text('No users found', { align: 'center' });
		}

		doc.end();
	} catch (error) {
		// Handle errors
		res.status(500).json({ error: error.message });
	}
};

export {
	createUser,
	loginUser,
	checkAuthStatus,
	logout,
	getUsers,
	getSingleUser,
	getCurrentUserProfile,
	updateCurrentUserProfile,
	deleteUser,
	searchUsers,
	generateReport,
	verifyUserOTP,
	changePassword,
	forgotPasswordRequest,
};
