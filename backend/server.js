import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import songRouter from './src/routes/songRoute.js';
import playlistRouter from './src/routes/playlistRoute.js';
import connectDB from './src/config/mongodb.js';
import connectCloudinary from './src/config/cloudinary.js';

// app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();


// middlewares
app.use(express.json());
app.use(cors());

// intializing routes
app.use("/api/song", songRouter);
app.use("/api/playlist", playlistRouter);
app.get('/', (req, res)=> res.send("API working."))

app.listen(port, () => console.log(`Server started on ${port}`))