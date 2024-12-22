import UserPlaylist from "../models/userPlaylistModel.js";
import User from "../models/userModel.js";

const createPlaylist = async (req, res) => {
    try {
        const { name, owner } = req.body;

        if (!name || !owner) {
            return res.status(400).json({ 
                success: false, 
                message: "Name and owner are required" 
            });
        }

        const newPlaylist = new UserPlaylist({
            name,
            owner,
            songs: []
        });

        await newPlaylist.save();

        res.json({ 
            success: true, 
            playlist: newPlaylist,
            message: "Playlist created successfully" 
        });
    } catch (error) {
        console.error('Error creating playlist:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Failed to create playlist" 
        });
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
        const { playlistId, name, owner } = req.body;

        // Find playlist and verify ownership
        const playlist = await UserPlaylist.findOne({ _id: playlistId, owner });
        if (!playlist) {
            return res.status(404).json({ success: false, message: "Playlist not found" });
        }

        // Update name if provided
        if (name) {
            playlist.name = name;
        }

        await playlist.save();
        res.json({ success: true, playlist });
    } catch (error) {
        console.error('Error updating playlist:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const addSongToPlaylist = async (req, res) => {
  try {
    const { playlistId, songId } = req.body;
    
    // Find the playlist
    const playlist = await UserPlaylist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }

    // Check if song already exists in playlist
    if (!playlist.songs.includes(songId)) {
      // Add song only if it doesn't exist
      playlist.songs.push(songId);
      await playlist.save();
    }
    
    return res.json({ success: true, playlist });
  } catch (error) {
    console.error('Error adding song to playlist:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export { createPlaylist, toggleSongInPlaylist, toggleLikedSong, listPlaylists, deletePlaylist, updatePlaylist, addSongToPlaylist };
