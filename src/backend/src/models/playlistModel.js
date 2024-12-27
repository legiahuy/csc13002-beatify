import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
    name: { type: String, require: true },
    desc: { type: String, require: true },
    bgColour: { type: String, require: true },
    image: { type: String, require: true },
})

const playlistModel = mongoose.models.playlist || mongoose.model("playlist", playlistSchema);

export default playlistModel;