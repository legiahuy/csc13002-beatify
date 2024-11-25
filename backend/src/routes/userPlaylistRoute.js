import express from "express";
import { createPlaylist, toggleSongInPlaylist, listPlaylists, deletePlaylist,toggleLikedSong } from "../controllers/userPlaylistController.js";

const userPlaylistRouter = express.Router();

userPlaylistRouter.post("/create", createPlaylist);
userPlaylistRouter.post("/toggle", toggleSongInPlaylist);
userPlaylistRouter.get("/list", listPlaylists);
userPlaylistRouter.post("/delete", deletePlaylist);
userPlaylistRouter.post("/toggleLikedSong", toggleLikedSong); 
export default userPlaylistRouter;
