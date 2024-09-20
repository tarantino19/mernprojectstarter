import router from 'express';
const userRouter = router();
import passport from 'passport';
import {
	getUsers,
	loginUser,
	checkAuthStatus,
	logout,
	createUser,
	getSingleUser,
	getCurrentUserProfile,
	updateCurrentUserProfile,
	deleteUser,
	searchUsers,
	generateReport,
	sendOTP,
	verifyOTP,
} from '../controllers/userController.js';
import '../strategies/local.strategy.js';
import { isAuthenticated, isAdmin } from '../middlewares/authMiddleware.js';

//check index.js - userRouter for initial route - all routes starts with /userApi in this case
//note: the order of routes also affects how and if it will work - dynamic :routes should be at the bottom to avoid conflict

//***GENERATE REPORT***
userRouter.get('/users/generate-report', isAuthenticated, generateReport);

//***OTP REQUEST***
userRouter.post('/otp-request', sendOTP);
userRouter.post('/verify-otp', verifyOTP);

//auth routes
userRouter.post('/signup', createUser);
userRouter.post('/login', passport.authenticate('local'), loginUser);
userRouter.get('/auth/status', checkAuthStatus);
userRouter.post('/logout', logout);

//***USER SEARCH ROUTES***
userRouter.get('/users/search', isAuthenticated, searchUsers);

//user REST API routes
userRouter.get('/users', isAuthenticated, isAdmin, getUsers);
userRouter.get('/users/:id', isAuthenticated, getSingleUser);
userRouter.delete('/users/:id', isAuthenticated, isAdmin, deleteUser);
userRouter.get('/user/profile', isAuthenticated, getCurrentUserProfile);
userRouter.patch('/user/profile/edit', isAuthenticated, updateCurrentUserProfile);

export default userRouter;
