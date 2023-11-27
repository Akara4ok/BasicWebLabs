import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/AuthRoutes.js';
import userRoutes from './routes/UserRoutes.js';
import cors from 'cors';
import { authMiddleware } from './middleware/AuthMiddleware.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/users', authMiddleware, userRoutes);

app.use((err, req, res, next) => {
		console.error(err.stack);
		res.status(500).send('Something went wrong!');
	}
);

const databaseUrl = process.env.MONGO_URI;

mongoose.connect("mongodb://localhost:27017/");

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});