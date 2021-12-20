import Video from "../models/Video";
import Comment from "../models/Comment";
import User from "../models/User";

export const home = async (req, res) => {
  const videos = await Video.find({})
  console.log(videos)
  .sort({ createdAt: "desc" })
  .populate("owner");
  return res.render("home", { pageTitle: "Home", videos });
};
export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner").populate("comments");
  
  //populate를 사용하면 owner와 바로 연결 시킬 수 있다
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  return res.render("watch", { pageTitle: video.title, video });
};
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user:{_id},
  } = req.session;
  const video = await Video.findById(id);
   if (!video) {
     return res.status(404).render("404", { pageTitle: "Video not found." });
   }
   if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
   }
   return res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
 };

 export const postEdit = async (req, res) => {
  const {
    user: {_id},
  } = req.session;
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "You are not the the owner of the video.");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("success", "Changes saved.");
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const {
    user: {_id},
  } = req.session;
  const { video, thumb } = req.files;
  const { title, description, hashtags } = req.body;
  try {
     const newVideo = await Video.create({
       title,
       description,
       fileUrl: video[0].location,
       thumbUrl: thumb[0].location,
       owner: _id,
       hashtags: Video.formatHashtags(hashtags),
     });
     const user = await User.findById(_id);
     user.videos.push(newVideo._id);
     user.save();
     return res.redirect("/");
   } catch (error) {
     console.log(error);
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: {_id},
  } = req.session;
  const video = await Video.findById(id);
  const user = await User.findById(_id);
  if (!video) {
    return res.status(404).render("404", {pageTitle: "Video not found."})
  }
  if (String(video.owner) !== String(_id)) {
    // owner은 object _id는 string 형태기 때문에 !==이 항상 false로 나온다. 그래서 동일한 형태인 string()으로 묶어준 것!
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  user.videos.splice(user.videos.indexOf(id),1);
  // splice배열 값 제거 추가 기능 indexOf는 해당 값에 해당하는 첫번째 값
  user.save();
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(`${keyword}$`, "i"),
      },
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views +1; 
  await video.save();
  return res.sendStatus(200);
  // render가 없어서 서버 브라우저에 sendStatus를 해준다
};

export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id);
  video.save();
  return res.status(201).json({ newCommentId: comment._id });
};

export const deleteComment = async (req, res) => {
  const {id} = req.params;
  const comment = await Comment.findById(id);
  if (String(comment._id)) {
    await Comment.findByIdAndDelete(id);
  } else {
    res.sendStatus(404);
  }
  //영상 업로더도 댓글 삭제할 수 있도록 만들었다
};