import { v2 as cloudinary } from 'cloudinary';
import bcryptjs from 'bcryptjs';
import User from '../models/userModel.js';

// Controller thêm user mới
const addUser = async (req, res) => {
    

    try {
        const { email, password, name, role } = req.body;
        const imageFile = req.file;
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        if (!email || !password || !name) {
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }

        // Kiểm tra xem người dùng đã tồn tại chưa
        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Hash mật khẩu
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Tạo mã xác thực và thời gian hết hạn
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

        

        const userData = {
            email,
            password: hashedPassword,
            name,
            role,
            verificationToken,
            verificationTokenExpiresAt,
            pfp: imageUpload.secure_url,
            playlist: [] // Khởi tạo playlist trống
        };

        const user = new User(userData);
        await user.save();


        // Gửi email xác thực

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined,
                verificationToken: undefined,
                verificationTokenExpiresAt: undefined
            }
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Controller lấy danh sách user
const listUser = async (req, res) => {
    try {
        const allUsers = await User.find({});
        res.json({ success: true, users: allUsers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Controller xoá user
const removeUser = async (req, res) => {
    try {
        const { id } = req.body;
        await User.findByIdAndDelete(id);
        res.json({ success: true, message: "User removed" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Controller thêm hoặc xóa bài hát khỏi playlist
const togglePlaylist = async (req, res) => {
    try {
        const { userId, songId } = req.body;

        if (!userId || !songId) {
            return res.status(400).json({ success: false, message: "User ID and Song ID are required!" });
        }

        // Tìm người dùng
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Kiểm tra bài hát trong playlist
        const songIndex = user.playlist.findIndex((song) => song === songId);

        if (songIndex > -1) {
            // Nếu bài hát đã có, xóa khỏi playlist
            user.playlist.splice(songIndex, 1);
            await user.save();
            return res.status(200).json({ 
                success: true, 
                message: "Song removed from playlist", 
                playlist: user.playlist 
            });
        } else {
            // Nếu bài hát chưa có, thêm vào playlist
            user.playlist.push(songId);
            await user.save();
            return res.status(200).json({ 
                success: true, 
                message: "Song added to playlist", 
                playlist: user.playlist 
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const likeSong = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const songId = req.params.id;

        if (user.playlist.includes(songId)) {
            const index = user.playlist.indexOf(songId);
            user.playlist.splice(index, 1);
            await user.save();
            return res.json({ success: true, message: "Removed from playlist" });
        }

        user.playlist.push(songId);
        await user.save();

        return res.json({ success: true, message: "Added to playlist" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { addUser, listUser, removeUser, togglePlaylist, likeSong };