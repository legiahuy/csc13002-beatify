import express from "express";
import { createPlaylist, toggleSongInPlaylist, listPlaylists, deletePlaylist,toggleLikedSong, updatePlaylist } from "../controllers/userPlaylistController.js";

const userPlaylistRouter = express.Router();

userPlaylistRouter.post("/create", createPlaylist);
userPlaylistRouter.post("/toggle", toggleSongInPlaylist);
userPlaylistRouter.post("/list", listPlaylists);
userPlaylistRouter.post("/delete", deletePlaylist);
userPlaylistRouter.post("/toggleLikedSong", toggleLikedSong);
userPlaylistRouter.post("/update", updatePlaylist);
export default userPlaylistRouter;
