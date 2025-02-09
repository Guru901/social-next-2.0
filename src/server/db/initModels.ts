import mongoose from "mongoose";
import { userSchema } from "@/server/models/userModel";
import { postSchema } from "@/server/models/postModel";
import { topicSchema } from "@/server/models/topicModel";
import { commentSchema } from "@/server/models/commentModel";
import { notificationSchema } from "@/server/models/notificationModel";

export async function initModels() {
  if (!mongoose.models.User) {
    mongoose.model("User", userSchema);
  }
  if (!mongoose.models.Post) {
    mongoose.model("Post", postSchema);
  }
  if (!mongoose.models.Topic) {
    mongoose.model("Topic", topicSchema);
  }
  if (!mongoose.models.Comment) {
    mongoose.model("Comment", commentSchema);
  }
  if (!mongoose.models.Notification) {
    mongoose.model("Notification", notificationSchema);
  }
}
