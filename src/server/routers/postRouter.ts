import { z } from "zod";
import auth from "../helper/auth";
import { j, publicProcedure } from "../jstack";
import Post from "../models/postModel";
import Comment from "../models/commentModel";
import User from "../models/userModel";
import { connectToDb } from "../db/connect";
import { CommentSchema, PostSchema } from "@/lib/schemas";

export const postRouter = j.router({
  getUserLikedPosts: publicProcedure.query(async ({ c }) => {
    await connectToDb();
    const { success, user, msg } = auth(c);
    if (!success) {
      return c.json({
        success: false,
        msg,
        posts: [],
      });
    }

    const post = await Post.find({
      likes: { $in: [user] },
      isPublic: true,
    });

    return c.json({
      success: true,
      msg: "Posts found",
      posts: post,
    });
  }),

  getAllPosts: publicProcedure
    .input(
      z.object({
        keyWord: z.string().default("general"),
      })
    )
    .query(async ({ c, input }) => {
      await connectToDb();
      const { success } = auth(c);
      if (!success) {
        return c.json({
          success: false,
          msg: "User not logged in",
          posts: [],
        });
      }

      const { keyWord } = input;

      const posts = await Post.find({
        isPublic: true,
        topic: keyWord.toLowerCase() || "",
      }).populate("user", "username avatar");

      return c.json({
        success: true,
        msg: "Posts found",
        posts,
      });
    }),

  getFriendsPost: publicProcedure.query(async ({ c }) => {
    await connectToDb();
    const { success, user, msg } = auth(c);
    if (!success) {
      return c.json({
        success: false,
        msg,
        posts: [],
      });
    }
    const loggedInUser = await User.findById(user);

    const friends = loggedInUser.friends;

    const posts = [];

    for (let i = 0; i < friends.length; i++) {
      const friend = friends[i];

      const post = await Post.find({ user: friend, topic: "general" }).populate(
        "user",
        "username avatar"
      );

      for (let p = 0; p < post.length; p++) {
        posts.push(post[p]);
      }
    }

    return c.json({
      success: true,
      msg: "Posts found",
      posts,
    });
  }),

  getPublicPosts: publicProcedure.query(async ({ c }) => {
    await connectToDb();
    const posts = await Post.find({ isPublic: true }).populate(
      "user",
      "username avatar"
    );

    return c.json({
      success: true,
      msg: "Posts found",
      posts,
    });
  }),

  like: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ c, input }) => {
      await connectToDb();
      const { success, user, msg } = auth(c);
      if (!success) {
        return c.json({
          success: false,
          msg,
          posts: [],
        });
      }

      const { id } = input;

      const post = await Post.findByIdAndUpdate(
        id,
        {
          $addToSet: { likes: user },
        },
        { new: true }
      );

      return c.json({
        success: true,
        msg: "Post liked",
        post,
      });
    }),

  unlike: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ c, input }) => {
      await connectToDb();
      const { success, user, msg } = auth(c);
      if (!success) {
        return c.json({
          success: false,
          msg,
          posts: [],
        });
      }

      const { id } = input;

      const post = await Post.findByIdAndUpdate(
        id,
        {
          $pull: { likes: user },
        },
        { new: true }
      );

      return c.json({
        success: true,
        msg: "Post unliked",
        post,
      });
    }),

  dislike: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ c, input }) => {
      await connectToDb();
      const { success, user, msg } = auth(c);
      if (!success) {
        return c.json({
          success: false,
          msg,
          posts: [],
        });
      }

      const { id } = input;

      const post = await Post.findByIdAndUpdate(
        id,
        {
          $addToSet: { dislikes: user },
        },
        { new: true }
      );

      return c.json({
        success: true,
        msg: "Post disliked",
        post,
      });
    }),

  disunlike: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ c, input }) => {
      await connectToDb();
      const { success, user, msg } = auth(c);
      if (!success) {
        return c.json({
          success: false,
          msg,
          posts: [],
        });
      }

      const { id } = input;

      const post = await Post.findByIdAndUpdate(
        id,
        {
          $pull: { dislikes: user },
        },
        { new: true }
      );

      return c.json({
        success: true,
        msg: "Post disunliked",
        post,
      });
    }),

  upload: publicProcedure.input(PostSchema).mutation(async ({ c, input }) => {
    await connectToDb();

    const { success, user, msg } = auth(c);
    if (!success) {
      return c.json({
        success: false,
        msg,
        posts: [],
      });
    }

    const { title, body, image, isPublic, username, topic } = input;

    const newPost = await Post.create({
      title: title,
      body: body,
      image: image,
      user: user,
      username: username,
      isPublic: isPublic,
      topic: topic,
    });
    await newPost.save();

    return c.json({
      success: true,
      msg: "Post uploaded",
      post: newPost,
    });
  }),

  getTopicPost: publicProcedure
    .input(z.object({ topicName: z.string() }))
    .query(async ({ c, input }) => {
      await connectToDb();

      const { topicName } = input;

      const posts = await Post.find({
        isPublic: true,
        topic: topicName.toLowerCase() || "",
      }).populate("user", "username avatar");

      return c.json({
        success: true,
        msg: "Post uploaded",
        posts: posts,
      });
    }),

  getPostById: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ input, c }) => {
      await connectToDb();

      const { postId } = input;

      const post = await Post.findById(postId).populate("user");

      return c.json({
        success: true,
        post: post,
      });
    }),

  getComments: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ c, input }) => {
      await connectToDb();

      const comments = await Comment.find({ post: input.postId });

      return c.json({
        success: true,
        comments,
      });
    }),

  comment: publicProcedure
    .input(CommentSchema)
    .mutation(async ({ input, c }) => {
      const { comment, postId, username, image, replyTo, avatar } = input;

      const newComment = await Comment.create({
        text: comment,
        post: postId,
        user: username,
        image: image,
        isAReply: replyTo ? true : false,
        avatar: avatar ? avatar : "",
      });

      if (replyTo.length > 0) {
        const reply = await Comment.findById(replyTo);
        if (reply) {
          reply.replies.push(newComment._id);
          await reply.save();
        }
      }

      await newComment.save();

      return c.json({
        success: true,
      });
    }),

  delete: publicProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ input, c }) => {
      await connectToDb();
      const { success, msg, user } = auth(c);

      if (!success) {
        return c.json({
          success: false,
          msg,
        });
      }

      const { postId } = input;

      await Post.findOneAndDelete({
        _id: postId,
        user: user,
      });

      return c.json({
        success: true,
        msg: "Post deleted successfully",
      });
    }),

  getAllComments: publicProcedure.query(async ({ c }) => {
    await connectToDb();
    const comments = await Comment.find();

    return c.json({
      success: true,
      msg: "Comments found",
      comments,
    });
  }),

  getAllPostForAdmin: publicProcedure.query(async ({ c }) => {
    await connectToDb();
    const posts = await Post.find();

    return c.json({
      success: true,
      msg: "Posts found",
      posts,
    });
  }),
});
