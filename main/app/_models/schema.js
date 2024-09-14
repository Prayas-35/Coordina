import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid'; // Import the uuid function

const departmentSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
        unique: true,
        default: uuidv4
    },
    username: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

export {
    departmentSchema
}
