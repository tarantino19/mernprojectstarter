import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './src/database/db.js';
import cors from 'cors';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import passport from 'passport';
import './src/strategies/local.strategy.js';
//router imports
import userRouter from './src/routes/user.routes.js';
import { deleteUnverifiedUserCron } from './src/controllers/deleteUserCron.js';
//define app
const app = express();

//run db
connectDB();

//middlewares
app.use(express.json());
// Determine the origin based on environment variables
const allowedOrigins = [
	'http://localhost:5173', // Development origin
	'https://your-production-frontend-domain.com', // Production origin
];

// CORS configuration
const corsOptions = {
	origin: (origin, callback) => {
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	credentials: true, // Allow cookies to be sent with requests
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true },
		store: MongoStore.create({
			client: mongoose.connection.getClient(),
			collectionName: 'sessions',
			ttl: 60 * 60 * 24,
		}),
	})
);

app.use(passport.initialize());
app.use(passport.session());

//routes
app.use('/userApi', userRouter);
//app.use('/productApi', productRouter);

deleteUnverifiedUserCron.start();

//start server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
