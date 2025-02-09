import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
      required: true,
    },
    user: {
      type: String,
      ref: "users",
      required: true,
    },
    image: {
      type: String,
    },
    avatar: {
      type: String,
    },
    isAReply: {
      type: Boolean,
      default: false,
    },
    replies: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "comments",
      default: [],
    },
  },
  { timestamps: true }
);

const Comment =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);

export default Comment;

export { commentSchema };
