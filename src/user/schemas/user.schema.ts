import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    login: { type: String, required: true },
    password: { type: String, required: true },
    admin: { type: Boolean, required: true},
});
