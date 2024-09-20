import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	avatar: {
		type: String,
	},
	isAdmin: {
		type: Boolean,
		default: false,
	},
	isEmailVerified: {
		type: Boolean,
		default: false,
	},
});

const User = mongoose.model('User', userSchema);
export default User;
