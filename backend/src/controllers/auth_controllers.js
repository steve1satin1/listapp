import { usersdb, otpdb } from "../config/config.js";
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import jsonwebtoken from "jsonwebtoken"
import otpGenerator from "otp-generator"
import nodemailer from "nodemailer"
import { OAuth2Client } from "google-auth-library"

dotenv.config()

export async function register(req, res) {
    // Get email and password from body
    const { email, password1, password2, otp } = req.body;
    // Check if everything was given
    if (!email || !password1 || !password2 || !otp) {
        return res.status(400).send({"Error": "Not all required data provided"})
    }
    // Check if user already exists
    const alreadyExists = await usersdb.find({email: email})

    if (alreadyExists.length > 0) {
        return res.status(400).send({"Error": "User already registered"})
    }

    // Check otp
    if (!(await verifyOtp(otp, email))){
        return res.status(400).send({"Error": "OTP wrong"})
    }
    
    // Check if password given 2 times much
    if (password1 === password2) {

        // Generate salt
        const salt = await bcrypt.genSalt(10);
        // Hash password with salt
        const hashedPassword = await bcrypt.hash(password1, salt);
        
        // Save User Database
        try {
            await usersdb.create({
                email: email.trim(),
                password: hashedPassword,
                salt: salt,
                authSource: "self"
            })
            
            return res.status(201).send({"message": "User created"})
        } catch (error) {
            return res.status(500).send({"Error": "Error while trying to create new account on database: ", error})
        }   
        
    } else {
        return res.status(400).send({"Error": "Password1 and Password2 does not much"})
    }
}

export async function alreadyExists(req, res) {
    const email = req.params.email;
    try {
        // Check if user already exists
        const alreadyExists = await usersdb.find({email: email})

        if (alreadyExists.length > 0) {
            return res.status(226).send({"Error": "User already registered"})
        } else {
            return res.status(200).send({"message": "User is not registered"})
        }
    } catch (error) {
        return res.status(500).send({"Error": "Error while trying to check if user already exists: ", error})
    }
}

export async function login(req, res) {
    const { email, password } = req.body;
    // Check that all required data are provided
    if (!email || !password) {
        return res.status(400).send({"Error": "Not all required data provided"})
    }

    // Retrieve user from database
    try {
        let user = await usersdb.find({email: email, authSource: "self"});
        // Check user is fetched
        if (user.length <= 0) {
            return res.status(404).send({"Error": "User is not registered"});
        } 

        user = user[0];
        // Verify Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            // Create JWT and save it in cookie jar
            const token = jsonwebtoken.sign({userid: user._id}, process.env.JWTSECRET, {expiresIn: 1000 * 60 * 60});
            // Save it in a cookie
            const cookieOptions = {
                expires: new Date(Date.now() + 1000 * 60),
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: "lax"
            }
            res.cookie('jwt_token', token, cookieOptions);
            return res.status(200).send({"Success": "User Logged in"})

        } else {
            return res.status(400).send({"Error": "The password given is wrong"})
        }
    } catch (error) {
        return res.status(500).send({"Error": `Error while fetching user credentials from database: ${error}`})
    }
} 

export async function logout(req, res) {
    console.log("inside logout controller")
    const token = req.cookies.jwt_token;
    if (token !== undefined) {
        res.clearCookie('jwt_token')
        return res.status(200).json({"Message": "Logged out"})
    } else {
        res.status(400).json({"Error": "You are not logged in"})
    }
}

// Generate otp controller
export async function generateOtp(req, res) {
    const {email} = req.body;
    const otp = otpGenerator.generate(6, {lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});
    try {
        // Save otp to DB
        await otpdb.create({otp, email})

        // Send email with otp
        const transporter = nodemailer.createTransport({
            host: 'smtp-relay.brevo.com',
            port: 2525,
            auth: {
                user: process.env.BREVOLOGIN,
                pass: process.env.BREVOKEY
            }
        });

        const response = await transporter.sendMail({
            from: "stevepd33333@gmail.com",
            to: email,
            subject: 'OTP Verification',
            text: `Your OTP for verification is: ${otp}`
        });        

        res.status(200).send('OTP sent successfully');

    } catch (error) {
        console.error("Error at generate otp controller: ", error);
        res.status(500).send('Error sending OTP');
    }
}

// Verify otp
async function verifyOtp(otp, email) {
    // Fetch otp from database
    try {
        const fetchedOtp = await otpdb.findOne({email: email, otp: otp}).exec();
        if (fetchedOtp) {
            return true;
        } else {
            return false
        }
    } catch (error) {
        console.error("Error at verify otp controller: ", error);
    }
}

export async function googleAuth(req, res) {
    const {credential, client_id} = req.body;
    const client = new OAuth2Client()

    try {
        // Verify token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: client_id,
        });
        const payload = ticket.getPayload();
        console.log("google payload: ", payload);

        // Check if user already exists
        let user = await usersdb.findOne({email: payload.email, authSource: 'google'});
        // Create a new user if they don't exist
        if (!user) {
            user = await usersdb.create({
                email: payload.email,
                authSource: 'google',
            });
        }
        /// Create JWT and save it in cookie jar
        const token = jsonwebtoken.sign({userid: user._id}, process.env.JWTSECRET, {expiresIn: 1000 * 60 * 60});
        // Save it in a cookie
        const cookieOptions = {
            expires: new Date(Date.now() + 1000 * 60 * 30),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "lax"
        }
        res.cookie('jwt_token', token, cookieOptions);
        return res.status(200).send({"Success": "User Logged in"})
        
    } catch (error) {
        console.error('Error during Google Authentication:', error);
        res.status(400).json({ error: 'Authentication failed', details: error });
    }
}