import passport from 'passport';
import { Strategy } from 'passport-local';
import { comparePassword } from '../utils/helpers.js';
import User from '../models/userSchema.js';

passport.serializeUser((user, done) => {
	console.log('Serializing user', user);
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	console.log('Deserializing user', id);
	try {
		const userId = await User.findById(id);
		done(null, userId);
	} catch (error) {
		done(error, null);
	}
});

export default passport.use(
	new Strategy(async (username, password, done) => {
		console.log('username', username, 'password', password);
		try {
			const findUser = await User.findOne({ username });

			if (!findUser) {
				throw new Error('User not found');
			}

			const isMatchedPassword = await comparePassword(password, findUser.password);

			if (!isMatchedPassword) {
				throw new Error('Invalid credentials');
			}

			done(null, findUser);
		} catch (error) {
			done(error, null);
		}
	})
);
