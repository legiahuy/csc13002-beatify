import { v2 as cloudinary } from 'cloudinary';
import playlistModel from '../models/playlistModel.js';

const addPlaylist = async (req, res) => {

    try {

        const name = req.body.name;
        const desc = req.body.desc;
        const bgColour = req.body.bgColour;
        const imageFile = req.file;
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });

        const playlistData = {
            name,
            desc,
            bgColour,
            image: imageUpload.secure_url
        };
        const playlist=playlistModel(playlistData);
        await playlist.save();
        res.json({success:true,message:'Playlist added'})

    } catch (error) {
        // Handle error
        res.json({success:false});
    }
};

const listPlaylist = async (req, res) => {

    try {
        const allPlaylists = await playlistModel.find({});
        res.json({ success: true, playlists: allPlaylists });
    } catch (error) {
        res.json({ success: false });
    }

};
const removePlaylist = async (req, res) => {
    try {
        await playlistModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Playlist removed" });
    } catch (error) {
        res.json({ success: false });
    }
};

export { addPlaylist, listPlaylist, removePlaylist }

