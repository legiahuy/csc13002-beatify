import mongoose from "mongoose";

const userPlaylistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    songs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "song"
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    image: {
        type: String,
        default: "/images/default-playlist.png"
    }
}, { timestamps: true });

const UserPlaylist = mongoose.model("UserPlaylist", userPlaylistSchema);
export default UserPlaylist;