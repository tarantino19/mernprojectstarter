import cron from 'node-cron';
import User from '../models/userSchema.js';

// Run the task every day at midnight

export const deleteUnverifiedUserCron = cron.schedule('0 0 * * *', async () => {
	try {
		const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

		console.log('running the program...');
		// Find and delete unverified users older than 30 days
		const result = await User.deleteMany({
			isEmailVerified: false,
			createdAt: { $lt: thirtyDaysAgo },
		});

		console.log(`${result.deletedCount} unverified users deleted`);
	} catch (error) {
		console.error('Error deleting unverified users:', error);
	}
});
