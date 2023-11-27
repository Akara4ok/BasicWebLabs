import express from 'express';
import User from '../model/User.js';
import { isAdminMiddleware } from '../middleware/AdminMiddleware.js';
import 'dotenv/config'

const router = express.Router();

router.get('/', async (req, res) => {
	try {
		const userId = req.user.id;

		const user = await User.findById(userId).select('-password');

		if (!user) {
			return res.status(404).send({ message: 'User not found' });
		}

		res.status(200).send(user);
	} catch (error) {
		console.error(error);
		res.status(400).send({ message: 'Fetching user data failed' });
	}
});

router.get(
	'/all',
	isAdminMiddleware,
	async (req, res) => {
		try {
			const users = await User.find().select('-password');
			res.status(200).send(users);
		} catch (error) {
			console.error(error);
			res.status(400).send({ message: 'Fetching all users failed' });
		}
	}
);

router.put(
	'/:id',
	async (req, res) => {
		const id = req.params.id;
		if(req.user.id !== id && req.user.role !== 'admin'){
			return res.status(403).send({message: 'Access denied'});
		}
		try {
			const user = await User.findByIdAndUpdate(
				id,
				req.body,
				{ new: true }
			).select('-password');
			if (!user) {
				return res.status(404).send('User not found');
			}
			return res.status(200).send(user);
		} catch (error) {
			res.status(500).send('Server error');
		}
	}
);

router.delete(
	'/:id',
	isAdminMiddleware,
	async (req, res) => {
		const id = req.params.id;
		try {
			const user = await User.findByIdAndDelete(id)
			if (!user) {
				return res.status(404).send('User not found');
			}
			return res.status(200).send(user);
		} catch (error) {
			res.status(500).send('Server error');
		}
	}
);

export default router;