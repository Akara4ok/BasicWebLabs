import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../model/User.js';
import 'dotenv/config'

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET_KEY;

router.post('/register', async (req, res) => {
	try {
		const { name, password, role, email, group, variant } =
			req.body;
		if (
			!name ||
			!password ||
			!role ||
			!email ||
			!group ||
			!variant
		) {
			return res.status(400).send({ message: 'Missing required fields.' });
		}

		const existingUser = await User.findOne({ username: name });
		if (existingUser) {
			return res.status(400).send({ message: 'Username already exists' });
		}

		const hashedPassword = await bcrypt.hash(password, 12);
		const user = new User({
			name,
			password: hashedPassword,
			role,
			email,
			group,
			variant,
		});
		await user.save();

		res.status(201).send({ message: 'User registered successfully' });
	} catch (error) {
		res.status(400).send({ message: 'Registration failed' });
	}
});

router.post('/login', async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res
			.status(400)
			.send({ message: 'Username and password are required' });
	}

	const user = await User.findOne({ email });

	if (!user) {
		return res.status(400).send({ message: 'User not found' });
	}

	const isValidPassword = await bcrypt.compare(password, user.password);
	if (!isValidPassword) {
		return res.status(400).send({ message: 'Invalid password' });
	}

	const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, {
		expiresIn: '1h',
	});
	res.send({ token, role: user.role });
});

export default router;