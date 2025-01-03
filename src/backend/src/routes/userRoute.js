import express from 'express';
import { addUser, listUser, removeUser,togglePlaylist, likeSong,addSongToRecentlyPlayed, listRecentlyPlayedSongs, getRecommendedSongs} from '../controllers/userController.js';
import upload from '../middleware/multer.js';

const userRouter = express.Router();

userRouter.post('/add', upload.single('image'), addUser);
userRouter.get('/list', listUser);
userRouter.post('/remove', removeUser);
userRouter.post('/toggle-playlist', togglePlaylist); 
userRouter.post("/song/:id", likeSong);
userRouter.post("/add-to-recently-played", addSongToRecentlyPlayed);
userRouter.post("/list-recently-played", listRecentlyPlayedSongs);
userRouter.get("/recommended-songs", getRecommendedSongs);

export default userRouter;
