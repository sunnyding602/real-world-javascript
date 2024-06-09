import { Schema, model } from 'mongoose'

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    followers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    following: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
})

export default model('User', userSchema)
