import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

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

const projectSchema = new mongoose.Schema({
    dept_uid: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    wardNumber: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    supervision: {
        type: String,
        required: true
    },
    resources: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['not-started', 'in-progress', 'completed'],
        default: 'not-started',
        required: true
    }
}, { timestamps: true });

export {
    departmentSchema,
    projectSchema
}
