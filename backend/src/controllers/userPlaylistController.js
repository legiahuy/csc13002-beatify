import UserPlaylist from "../models/userPlaylistModel.js";
import User from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";

const createPlaylist = async (req, res) => {
    try {
        const { name, owner } = req.body;

        if (!name || !owner) {
            return res.status(400).json({ success: false, message: "Playlist name and owner are required!" });
        }

        const playlist = new UserPlaylist({
            name,
            owner,
            songs: []
        });

        await playlist.save();

        // Thêm playlist vào danh sách playlist của user
        const user = await User.findById(owner);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        user.playlists.push(playlist._id);
        await user.save();

        res.status(201).json({ success: true, playlist });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const toggleSongInPlaylist = async (req, res) => {
    try {
        const { playlistId, songId, owner } = req.body;

        if (!playlistId || !songId || !owner) {
            return res.status(400).json({ success: false, message: "Playlist ID, Song ID, and owner are required!" });
        }

        const playlist = await UserPlaylist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({ success: false, message: "Playlist not found" });
        }

        if (playlist.owner.toString() !== owner) {
            return res.status(403).json({ success: false, message: "You do not own this playlist" });
        }

        const songIndex = playlist.songs.findIndex((song) => song.toString() === songId);

        if (songIndex > -1) {
            // Nếu bài hát đã tồn tại, xóa nó
            playlist.songs.splice(songIndex, 1);
            await playlist.save();
            return res.status(200).json({ success: true, message: "Song removed from playlist", playlist });
        } else {
            // Nếu bài hát chưa tồn tại, thêm nó
            playlist.songs.push(songId);
            await playlist.save();
            return res.status(200).json({ success: true, message: "Song added to playlist", playlist });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const toggleLikedSong = async (req, res) => {
    try {
        const { userId, songId } = req.body;

        if (!userId || !songId) {
            return res.status(400).json({ success: false, message: "User ID and Song ID are required!" });
        }

        // Tìm playlist mặc định "Liked Songs" dựa trên tên và owner
        const likedPlaylist = await UserPlaylist.findOne({ owner: userId, name: "Liked Songs" });
        if (!likedPlaylist) {
            return res.status(404).json({ success: false, message: "Liked playlist not found" });
        }

        // Kiểm tra xem bài hát đã tồn tại chưa
        const songIndex = likedPlaylist.songs.findIndex((id) => id.toString() === songId);

        if (songIndex > -1) {
            // Nếu bài hát đã tồn tại, xóa khỏi playlist
            likedPlaylist.songs.splice(songIndex, 1);
            await likedPlaylist.save();

            return res.status(200).json({
                success: true,
                message: "Song removed from liked playlist",
                likedPlaylist,
            });
        } else {
            // Nếu bài hát chưa tồn tại, thêm vào playlist
            likedPlaylist.songs.push(songId);
            await likedPlaylist.save();

            return res.status(200).json({
                success: true,
                message: "Song added to liked playlist",
                likedPlaylist,
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



const listPlaylists = async (req, res) => {
    try {
        const { owner } = req.body;

        if (!owner) {
            return res.status(400).json({ success: false, message: "Owner ID is required!" });
        }

        const playlists = await UserPlaylist.find({ owner }).populate("songs");
        res.status(200).json({ success: true, playlists });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const deletePlaylist = async (req, res) => {
    try {
        const { playlistId, owner } = req.body;

        if (!playlistId || !owner) {
            return res.status(400).json({ success: false, message: "Playlist ID and owner are required!" });
        }

        const playlist = await UserPlaylist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({ success: false, message: "Playlist not found" });
        }

        if (playlist.owner.toString() !== owner) {
            return res.status(403).json({ success: false, message: "You do not own this playlist" });
        }

        await UserPlaylist.findByIdAndDelete(playlistId);


        // Xóa playlist khỏi user
        const user = await User.findById(owner);
        if (user) {
            user.playlists = user.playlists.filter((id) => id.toString() !== playlistId);
            await user.save();
        }

        res.status(200).json({ success: true, message: "Playlist deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updatePlaylist = async (req, res) => {
    try {
        const { playlistId, name } = req.body;
        const image = req.files?.image;

        const playlist = await UserPlaylist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({ success: false, message: "Playlist not found" });
        }

        if (name) {
            playlist.name = name;
        }

        if (image) {
            // Upload ảnh mới lên Cloudinary
            const result = await cloudinary.uploader.upload(image.tempFilePath, {
                folder: "playlist_covers",
            });
            playlist.image = result.secure_url;
        }

        await playlist.save();
        res.status(200).json({ success: true, playlist });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { createPlaylist, toggleSongInPlaylist,toggleLikedSong, listPlaylists, deletePlaylist, updatePlaylist };
