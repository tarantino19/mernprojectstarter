import User from '../models/userSchema.js';
import { hashPassword, comparePassword } from '../utils/helpers.js';
import bcrypt from 'bcrypt';
import PDFDocument from 'pdfkit';
import axios from 'axios';

//***AUTH***
const createUser = async (req, res) => {
	try {
		const { username, password, email, isAdmin } = req.body;

		const existingUser = await User.findOne({ username });

		if (existingUser) {
			return res.status(401).json({ error: 'Username already exists' });
		}

		if (!username || !password || !email) {
			return res.status(400).json({ error: 'Username, email, and password are required' });
		}

		if (password.length < 6) {
			return res.status(400).json({ error: 'Password must be at least 6 characters' });
		}

		const hashedPassword = await hashPassword(password);

		const newUser = new User({
			username,
			email,
			password: hashedPassword,
			isAdmin: isAdmin || false, // Default to false if not provided
		});

		const user = await newUser.save();
		res.status(200).json({ message: 'User created successfully', user: user });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

const loginUser = async (req, res) => {
	//this controller isn't necessary to log in user but it is used for double checking and logging
	//passport-local already authenticated ths user even before this controller runs

	const { username, password } = req.body;

	const user = await User.findOne({ username });
	if (!user) {
		return res.status(401).json({ error: 'Invalid username or password' });
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
};
