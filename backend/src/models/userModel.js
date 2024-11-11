import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type:String,
        required:true,
        unique:true
    },
    password: {
        type:String,
        required:true
    },
    name: {
        type:String,
        required:true
    },
    role: {
        type:String,
        default: "user"
    },
    playlist:[ 
        {
            type: String,
            required:true,
        },
    ],
    lastLogin: {
        type:Date,
        default: Date.now
    },
    isVerified: {
        type:Boolean,
        default: false
    },
    pfp: { 
        type: String, 
        require: true 
    },

    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
}, {timestamps: true});


const User = mongoose.model('User', userSchema);

export default User;


