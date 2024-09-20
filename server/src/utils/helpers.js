import bcrypt from 'bcrypt';

const hashPassword = async (password) => {
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	return hashedPassword;
};

const comparePassword = async (password, hashedPassword) => {
	return await bcrypt.compare(password, hashedPassword);
};

const hashOTP = async (password) => {
	if (typeof password !== 'string') {
		throw new Error('Password must be a string');
	}
	const saltRounds = 10; // or any number of rounds you prefer
	return await bcrypt.hash(password, saltRounds);
};

export { hashPassword, comparePassword, hashOTP };
