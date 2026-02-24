import dotenv from "dotenv"
import mongoose from "mongoose"
import { rateLimit } from 'express-rate-limit'


dotenv.config()

export default async function conectDb() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected")
}

const notesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    until: {
        type: Date,
        required: false
    },
    userid: {
        type: String,
        required: true
    }
}, {timestamps: true});

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false
    },
    salt: {
        type: String,
        required: false
    },
    authSource: { // either `google` or `self`
        type: String,
        required: true
    }
})

const otpSchema = new mongoose.Schema({
    otp: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    createdAt: { 
        type: Date, 
        expires: '1m', 
        default: Date.now
    }
});

export const notesdb = mongoose.model('notesdb', notesSchema);
export const usersdb = mongoose.model('usersdb', userSchema);
export const otpdb = mongoose.model('otpdb', otpSchema);

export const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 15 minutes
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
    statusCode: 429,
    message: {"message": "Rate limit reached"},
});
