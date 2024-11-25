import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import 'dotenv/config'
import songRouter from './src/routes/songRoute.js';
import playlistRouter from './src/routes/playlistRoute.js';
import artistRouter from './src/routes/artistRoute.js';
import authRouter from './src/routes/authRoute.js'
import connectDB from './src/config/mongodb.js';
import connectCloudinary from './src/config/cloudinary.js';
import userRouter from './src/routes/userRoute.js';
import userPlaylistRouter from './src/routes/userPlaylistRoute.js';

// app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();


// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true}));

// intializing routes
app.use("/api/song", songRouter);
app.use("/api/playlist", playlistRouter);
app.use("/api/artist", artistRouter);
app.use("/api/user", userRouter);
app.use("/api/userPlaylist",userPlaylistRouter)
app.get('/', (req, res)=> res.send("API working."))

app.use("/api/auth", authRouter);

app.listen(port, () => console.log(`Server started on ${port}`))