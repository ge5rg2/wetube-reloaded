import mongoose from "mongoose";

 const videoSchema = new mongoose.Schema({
   title: { type: String, required: true, trim: true, maxLength: 80 },
   fileUrl: {type: String, required: true},
   thumbUrl: { type: String, required: true },
   description: { type: String, required: true, trim: true, minLength: 2 },
   createdAt: { type: Date, required: true, default: Date.now },
   hashtags: [{ type: String }],
   meta: {
    views: { type: Number, default: 0, required: true },
   },
   comments: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
  ],
   owner: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
   // 중요하니까 복습할 것
 });

 videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

 const Video = mongoose.model("Video", videoSchema);
 export default Video;