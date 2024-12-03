import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        role: {
            type: String,
            enum: ["user", "admin", "curator"],
            default: "user",
        },
        plan: {
            type: String,
            enum: ["free", "premium"],
            default: "free",
        },
        playlists: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "UserPlaylist", // Tham chiếu đến playlist của user
            },
        ],
        lastLogin: {
            type: Date,
            default: Date.now, // Thời gian đăng nhập cuối cùng
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        pfp: {
            type: String, // URL của ảnh đại diện (profile picture)
        },
        resetPasswordToken: {
            type: String, // Token dùng để reset mật khẩu
        },
        planExpires: {
            type: Date, 
            default: null,
        },
        resetPasswordExpiresAt: {
            type: Date, // Thời gian hết hạn token reset mật khẩu
        },
        verificationToken: {
            type: String, // Token dùng để xác minh email
        },
        verificationTokenExpiresAt: {
            type: Date, // Thời gian hết hạn token xác minh email
        },
    },
    { timestamps: true } // Tự động thêm createdAt và updatedAt
);

const User = mongoose.model("User", userSchema);

export default User;
