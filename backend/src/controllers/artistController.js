import { v2 as cloudinary } from 'cloudinary';
import artistModel from '../models/artistModel.js';

const addArtist = async (req, res) => {

    try {
        const name = req.body.name;
        const desc = req.body.desc;
        const bgColour = req.body.bgColour;
        const imageFile = req.file;
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });

        const artistData = {
            name,
            desc,
            bgColour,
            pfp: imageUpload.secure_url
        };
        const artist = artistModel(artistData);
        await artist.save();
        res.json({success:true,message:'Artist added'})

    } catch (error) {
        // Handle error
        res.json({success:false});
    }
};

const listArtist = async (req, res) => {

    try {
        const allArtists = await artistModel.find({});
        res.json({ success: true, artists: allArtists });
    } catch (error) {
        res.json({ success: false });
    }

};
const removeArtist = async (req, res) => {
    try {
        await artistModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Artist removed" });
    } catch (error) {
        res.json({ success: false });
    }
};

const updateCatalog = async (req, res) => {
    const { artistId, songId } = req.body;
    
    try {
      await artistModel.findByIdAndUpdate(
        artistId,
        { $addToSet: { catalog: songId } }, 
        { new: true }
      );
      res.json({ success: true, message: "Catalog updated" });
    } catch (error) {
      res.json({ success: false, message: "Error updating catalog" });
    }
  };

export { addArtist, listArtist, removeArtist, updateCatalog }

