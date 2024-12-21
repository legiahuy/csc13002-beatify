import express from "express";
import { createPlaylist, toggleSongInPlaylist, listPlaylists, deletePlaylist, toggleLikedSong, updatePlaylist, addSongToPlaylist } from "../controllers/userPlaylistController.js";
import multer from "multer";

const userPlaylistRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

userPlaylistRouter.post("/create", createPlaylist);
userPlaylistRouter.post("/toggle", toggleSongInPlaylist);
userPlaylistRouter.post("/list", listPlaylists);
userPlaylistRouter.post("/delete", deletePlaylist);
userPlaylistRouter.post("/toggleLikedSong", toggleLikedSong);
userPlaylistRouter.post("/update", updatePlaylist);
userPlaylistRouter.post("/add-song", addSongToPlaylist);

export default userPlaylistRouter;
