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
} from '../controllers/userController.js';
import '../strategies/local.strategy.js';
import { isAuthenticated, isAdmin } from '../middlewares/authMiddleware.js';

//auth routes
userRouter.post('/signup', createUser);
userRouter.post('/login', passport.authenticate('local'), loginUser);
userRouter.get('/auth/status', checkAuthStatus);
userRouter.post('/logout', logout);

//user routes
userRouter.get('/users', isAuthenticated, isAdmin, getUsers);
userRouter.get('/users/:id', isAuthenticated, getSingleUser);
userRouter.delete('/users/:id', isAuthenticated, isAdmin, deleteUser);
userRouter.get('/user/profile', isAuthenticated, getCurrentUserProfile);
userRouter.patch('/user/profile/edit', isAuthenticated, updateCurrentUserProfile);

export default userRouter;
