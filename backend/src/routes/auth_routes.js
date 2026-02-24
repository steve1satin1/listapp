import express from "express"
import { register, login, logout, generateOtp, alreadyExists, googleAuth } from "../controllers/auth_controllers.js"

const authRouter = express.Router()

authRouter.post("/register", register);
authRouter.post("/login", login)
authRouter.get("/logout", logout)
authRouter.post("/generate_otp", generateOtp)
authRouter.get("/already_exists/:email", alreadyExists)
authRouter.post("/google_auth", googleAuth)

export default authRouter;