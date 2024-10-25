import express from 'express';
import { addPlaylist, listPlaylist, removePlaylist } from '../controllers/playlistController.js';
import upload from '../middleware/multer.js';

const playlistRouter = express.Router();

playlistRouter.post('/add', upload.single('image'), addPlaylist);
playlistRouter.get('/list', listPlaylist);
playlistRouter.post('/remove', removePlaylist);

export default playlistRouter;
