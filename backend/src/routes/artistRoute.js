import express from 'express';
import { addArtist, listArtist, removeArtist, updateCatalog } from '../controllers/artistController.js';
import upload from '../middleware/multer.js';

const artistRouter = express.Router();

artistRouter.post('/add', upload.single('image'), addArtist);
artistRouter.get('/list', listArtist);
artistRouter.post('/remove', removeArtist);
artistRouter.patch('/update-catalog', updateCatalog);

export default artistRouter;
