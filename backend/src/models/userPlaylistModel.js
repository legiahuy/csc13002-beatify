import mongoose from "mongoose";

const userPlaylistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    songs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Song"
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

const UserPlaylist = mongoose.model("UserPlaylist", userPlaylistSchema);

export default UserPlaylist;
