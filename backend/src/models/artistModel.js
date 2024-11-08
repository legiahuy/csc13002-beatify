import mongoose from "mongoose";

const artistSchema = new mongoose.Schema({
    name: { type: String, require: true },
    desc: { type: String, require: true },
    pfp: { type: String, require: true },
    bgColour: { type: String, require: true }
})

const artistModel = mongoose.models.artist || mongoose.model("artist", artistSchema);

export default artistModel;