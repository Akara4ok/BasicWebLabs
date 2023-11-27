import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
	name: { type: String, required: true },
	password: { type: String, required: true },
	group: { type: String, required: true },
	variant: { type: String, required: true },
	role: { type: String, default: 'user' },
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;