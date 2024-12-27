import express from "express"
import { 
    signup, 
    login, 
    logout, 
    verifyEmail, 
    forgotPassword, 
    resetPassword, 
    checkAuth,
} from '../controllers/authController.js'
import { verifyToken } from "../middleware/verifyToken.js";

const authRouter = express.Router();

authRouter.get("/check-auth", verifyToken, checkAuth);

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

authRouter.post("/verify-email", verifyEmail);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password/:token", resetPassword);

export default authRouter;