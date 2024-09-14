import mongoose from 'mongoose'

const exampleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    }
});


export {
    exampleSchema
}