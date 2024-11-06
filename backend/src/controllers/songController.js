import { v2 as cloudinary } from "cloudinary";
import songModel from "../models/songModel.js";

const addSong = async (req, res) => {
    try {
        const name = req.body.name;
        const artist_id = req.body.artist_id
        const desc = req.body.desc;
        const playlist = req.body.playlist;
        const audioFile = req.files.audio[0];
        const imageFile = req.files.image[0];
        const audioUpload = await cloudinary.uploader.upload(audioFile.path, {resource_type: "video"});
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: "image"});    
        const duration = `${Math.floor(audioUpload.duration/60)}:${Math.floor(audioUpload.duration%60)}`

        console.log(name, artist_id, desc, playlist, audioUpload, imageUpload);

        const songData = {
            name, 
            artist_id,
            desc,
            playlist,
            image: imageUpload.secure_url,
            file: audioUpload.secure_url,
            duration
        }

        const song = songModel(songData);
        await song.save();

        res.json({ success: true, message: "Song added!", songId: song._id });

    } catch (error) {
        res.json({success: false})
    }
}

const listSong = async (req, res) => {
    try {
        const allSongs = await songModel.find({});
        res.json({success: true, songs: allSongs});
    } catch (error) {
        res.json({success: false});
    }
}

const removeSong = async (req, res) => {
    try {
        await songModel.findByIdAndDelete(req.body.id);
        res.json({success: true, message: "Song removed!"})
    } catch (error) {
        res.json({success: false});
    }
}

export {addSong, listSong, removeSong}