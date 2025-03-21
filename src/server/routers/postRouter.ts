import { z } from "zod";
import auth from "../lib/auth";
import { j, privateProcedure, publicProcedure } from "../jstack";
import Post from "../models/postModel";
import Comment from "../models/commentModel";
import User from "../models/userModel";
import { connectToDb } from "../db/connect";
import { CommentSchema, PostSchema } from "@/lib/schemas";

export const postRouter = j.router({
  getUserLikedPosts: privateProcedure.query(async ({ c, ctx }) => {
    await connectToDb();

    const post = await Post.find({
      likes: { $in: [ctx.auth] },
      isPublic: true,
    });

    return c.json({
      success: true,
      msg: "Posts found",
      posts: post,
    });
  }),

  getAllPosts: privateProcedure
    .input(
      z.object({
        keyWord: z.string().default("general"),
        page: z.number(),
      }),
    )
    .query(async ({ c, input }) => {
      await connectToDb();

      const { keyWord, page } = input;
      const limit = 10;

      if (page === -1) {
        const posts = await Post.find({
          isPublic: true,
          topic: keyWord.toLowerCase() || "",
        }).populate("user", "username avatar");

        return c.json({
          success: true,
          msg: "Posts found",
          posts,
        });
      }

      const posts = await Post.find({
        isPublic: true,
        topic: keyWord.toLowerCase() || "",
      })
        .populate("user", "username avatar")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

      return c.json({
        success: true,
        msg: "Posts found",
        posts,
      });
    }),

  getFriendsPost: privateProcedure
    .input(z.object({ page: z.number() }))
    .query(async ({ c, ctx, input }) => {
      await connectToDb();
      const loggedInUser = await User.findById(ctx.auth);

      const friends = loggedInUser.friends;
      const { page } = input;
      const limit = 10;

      const posts = [];
      const totalPosts = friends.length;
      const startIndex = (page - 1) * limit;
      let collectedPosts = 0;

      for (let i = 0; i < friends.length; i++) {
        const friend = friends[friends.length - 1 - i];

        const friendPosts = await Post.find({
          user: friend,
          topic: "general",
        })
          .populate("user", "username avatar")
          .sort({ createdAt: -1 });

        for (let post of friendPosts) {
          if (
            collectedPosts >= startIndex &&
            collectedPosts < startIndex + limit
          ) {
            posts.push(post);
          }
          collectedPosts++;
        }

        if (collectedPosts >= startIndex + limit) break;
      }

      return c.json({
        success: true,
        msg: "Posts found",
        posts,
      });
    }),

  getPublicPosts: publicProcedure
    .input(z.object({ page: z.number() }))
    .query(async ({ c, input }) => {
      await connectToDb();
      const { page } = input;
      const limit = 10;

      if (page === -1) {
        const posts = await Post.find({ isPublic: true }).populate(
          "user",
          "username avatar",
        );

        return c.json({
          success: true,
          msg: "Posts found",
          posts,
        });
      }

      const posts = await Post.find({ isPublic: true })
        .populate("user", "username avatar")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

      return c.json({
        success: true,
        msg: "Posts found",
        posts,
      });
    }),

  like: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ c, input, ctx }) => {
      await connectToDb();

      const { id } = input;

      const post = await Post.findByIdAndUpdate(
        id,
        {
          $addToSet: { likes: ctx.auth },
        },
        { new: true },
      );

      return c.json({
        success: true,
        msg: "Post liked",
        post,
      });
    }),

  unlike: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ c, input, ctx }) => {
      await connectToDb();

      const { id } = input;

      const post = await Post.findByIdAndUpdate(
        id,
        {
          $pull: { likes: ctx.auth },
        },
        { new: true },
      );

      return c.json({
        success: true,
        msg: "Post unliked",
        post,
      });
    }),

  dislike: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ c, input, ctx }) => {
      await connectToDb();

      const { id } = input;

      const post = await Post.findByIdAndUpdate(
        id,
        {
          $addToSet: { dislikes: ctx.auth },
        },
        { new: true },
      );

      return c.json({
        success: true,
        msg: "Post disliked",
        post,
      });
    }),

  disunlike: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ c, input, ctx }) => {
      await connectToDb();

      const { id } = input;

      const post = await Post.findByIdAndUpdate(
        id,
        {
          $pull: { dislikes: ctx.auth },
        },
        { new: true },
      );

      return c.json({
        success: true,
        msg: "Post disunliked",
        post,
      });
    }),

  upload: privateProcedure
    .input(PostSchema)
    .mutation(async ({ c, ctx, input }) => {
      await connectToDb();

      const { title, body, image, isPublic, username, topic } = input;

      const newPost = await Post.create({
        title: title,
        body: body,
        image: image,
        user: ctx.auth,
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

  comment: privateProcedure
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

  delete: privateProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ input, c, ctx }) => {
      await connectToDb();

      const { postId } = input;

      await Post.findOneAndDelete({
        _id: postId,
        user: ctx.auth,
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

  handleDeleteComment: privateProcedure
    .input(z.object({ commentId: z.string() }))
    .query(async ({ c, ctx, input }) => {
      await connectToDb();

      const comment = await Comment.findByIdAndDelete(input.commentId);

      return c.json({
        success: true,
        msg: "connect deleted",
      });
    }),
});
