import bcryptjs from "bcryptjs"
import crypto from "crypto"
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js"
import  User  from "../models/userModel.js";
import UserPlaylist from "../models/userPlaylistModel.js";


import { 
    sendVerificationEmail, 
    sendWelcomeEmail, 
    sendPasswordResetEmail, 
    sendResetSuccessEmail
} from "../../mailtrap/emails.js";


export const signup = async (req, res) => {
    const {email, password, name} = req.body;
    try {
        if(!email || !password || !name) {
            throw new Error("All fields are required!");
        }

        const userAlreadyExists =  await User.findOne({email});

        console.log("userAlreadyExists", userAlreadyExists);

        if(userAlreadyExists) {
            return res.status(400).json({success:false, message: "User already exists"})
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        console.log(hashedPassword)
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            email,
            password: hashedPassword,
            name,
            plan: "free",
            role: "user",
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
            playlist: [] // Khởi tạo playlist trống
        })

        await user.save();

        // jwt

        generateTokenAndSetCookie(res,user)

        const likedPlaylist = new UserPlaylist({
            name: "Liked Songs",
            owner: user._id,
            songs: [],
            image: "/images/liked-songs.png"
        });

        await likedPlaylist.save();

        // Thêm playlist vào danh sách `playlists` của user
        user.playlists.push(likedPlaylist._id);
        await user.save();

        await sendVerificationEmail(user.email, verificationToken)

        res.status(201).json({
            success:true, 
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined,
            }
        })

    } catch (error) {
        res.status(400).json({success:false, message: error.message})
    }
}

export const verifyEmail = async (req, res) => {
    const {code} = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now()}

        })
        if(!user) {
            return res.status(400).json({success:false, message: "Invalid or expired verification code"})
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined,
            }    
        })

    } catch (error) {
        console.log("Error in verifying email", error);
        res.status(500).json({success:false, message:"Server error!"});
    }
}

export const login = async (req, res) => {
    const { email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({success:false, message: "Account not found"});
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(400).json({success:false, message: "Invalid email or password"});
        }

        generateTokenAndSetCookie(res, user);
        user.lastLogin = new Date();

        await user.save()

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
            }    
        })

    } catch(error) {
        console.log("Error in login", error);
        res.status(500).json({success:false, message:error.message});
    }
}

export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({success:true, message: "Logged out successfully"});
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    
    try {
        const user = await User.findOne({email}); 
        
        if(!user) {
            return res.status(400).json({success:false, message: "User not found!"});
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 10000; // 1 hour
        console.log(resetToken, resetTokenExpiresAt);
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        // Send email

        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({success: true, message: "Password reset link sent to your email"});
    } catch (error) {
        console.log("Error in forgotPassword", error);
        res.status(400).json({success: false, message: error.message});
    }
}

export const resetPassword = async (req, res) => {
    try {
        const {token} = req.params;
        const {password} = req.body;
        
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: {$gt: Date.now()},
        })
        if(!user) {
            return res.status(400).json({success:false, message: "Invalid or expired reset token"});
        }

        // update password

        const hashedPassword = await bcryptjs.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        await user.save();

        await sendResetSuccessEmail(user.email);

        return res.status(200).json({success:true, message: "Password reset successfully"});

    } catch(error) {
        console.log("Error in resetPassword", error);
        res.status(400).json({success: false, message: error.message});
    }
}

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if(!user) {
            return res.status(400).json({success:false, message: "User not found"});
        }
        if (user.plan === "premium" && user.planExpires && new Date(user.planExpires) < new Date()) {
            user.plan = "free";
            user.planExpires = null;
            await user.save();
        }
        res.status(200).json({success:true, user });
    }
    catch(error) {
        console.log("Error in checkAuth", error);
        res.status(400).json({success: false, message: error.message});
    }
}