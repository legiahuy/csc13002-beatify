import express from "express"
import { signup, login, logout, verifyEmail } from '../controllers/authController.js'

const authRouter = express.Router();

authRouter.post("/signup", signup);

authRouter.post("/login", login);

authRouter.post("/logout", logout);

authRouter.post("/verify-email", verifyEmail);

export default authRouter;