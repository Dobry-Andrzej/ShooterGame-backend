import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    name: { type: String },
    surname: { type: String },
    login: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true},
    admin: { type: Boolean },
});
