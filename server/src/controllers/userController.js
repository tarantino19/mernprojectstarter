import User from '../models/userSchema.js';
import { hashPassword, comparePassword } from '../utils/helpers.js';
import bcrypt from 'bcrypt';

//***AUTH***
const createUser = async (req, res) => {
	try {
		const { username, password, email, isAdmin } = req.body;

		const existingUser = await User.findOne({ username });

		if (existingUser) {
			return res.status(400).json({ error: 'Username already exists' });
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
	const { username, password } = req.body;

	if (!username || !password) {
		return res.status(400).json({ error: 'Username and password are required' });
	}

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
	res.status(200).json({ message: 'You are now logged in. User is now authenticated' });
};

const checkAuthStatus = async (req, res) => {
	console.log('Inside status');
	console.log('statusAuth', req.user);
	console.log('reqSession', req.session);
	if (!req.user) {
		return res.status(401).json({ error: 'Unauthorized' });
	}
	return res.status(200).json({ message: 'User is logged in and session is active' });
};

const logout = (req, res, next) => {
	if (!req.isAuthenticated()) {
		return res.status(401).json({ error: 'Unauthorized. You are not logged in yet' });
	}

	req.logout((error) => {
		if (error) {
			return next(error);
		}

		console.log('clearing cookies...');
		res.clearCookie('connect.sid');
		console.log('You are now logged out..');
		res.status(200).json({ message: 'Logout successful' });
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

		if (user) {
			user.username = req.body.username || user.username;
			user.email = req.body.email || user.email;

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
};
