import express from 'express';
import { addUser, listUser, removeUser } from '../controllers/userController.js';
import upload from '../middleware/multer.js';

const userRouter = express.Router();

userRouter.post('/add', upload.single('image'), addUser);
userRouter.get('/list', listUser);
userRouter.post('/remove', removeUser);

export default userRouter;
