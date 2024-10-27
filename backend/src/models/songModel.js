import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
  name: { type: String, require: true },
  artist_id: { type: String, require: true },
  desc: { type: String, require: true },
  playlist: { type: String, require: true },
  image: { type: String, require: true },
  file: { type: String, require: true },
  duration: { type: String, require: true },
});

const songModel = mongoose.models.song || mongoose.model("song", songSchema);

export default songModel;
