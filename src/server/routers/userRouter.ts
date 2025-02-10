import { j, publicProcedure } from "../jstack";
import { AddFriendSchema, LoginSchema, SignUpSchema } from "@/lib/schemas";
import User from "../models/userModel";
import { connectToDb } from "../db/connect";
import jwt from "jsonwebtoken";
import { setCookie, getCookie } from "hono/cookie";
import { z } from "zod";
import auth from "../helper/auth";
import Post from "../models/postModel";
import Notifications from "../models/notificationModel";

export const userRouter = j.router({
  register: publicProcedure
    .input(SignUpSchema)
    .mutation(async ({ input, c }) => {
      await connectToDb();
      const { username, password, avatar } = input;

      const existingUser = await User.findOne({ username: username });

      if (existingUser) {
        return c.json({
          success: false,
          msg: "Username already taken",
        });
      }

      const newUser = await User.create({
        avatar,
        username,
        password,
      });

      await newUser.save();

      newUser.password = "";

      const tokenData = {
        id: newUser._id,
      };

      const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!);

      const response = c.json({
        success: true,
        data: newUser,
        msg: "registered successfully",
      });

      setCookie(c, "token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(Date.now() + 3600 * 1000),
      });

      return response;
    }),

  login: publicProcedure.input(LoginSchema).mutation(async ({ input, c }) => {
    await connectToDb();
    const { username, password } = input;

    const user = await User.findOne({ username: username });

    if (!user) {
      return c.json({
        success: false,
        msg: "Username or password is incorrect",
      });
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (isPasswordCorrect) {
      const tokenData = {
        id: user._id,
      };

      const token = jwt.sign(tokenData, process.env.TOKEN_SECRET as string);
      user.password = "";

      setCookie(c, "token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(Date.now() + 3600 * 1000),
      });

      return c.json({
        success: true,
        data: user,
        msg: "logged in successfully",
      });
    }

    return c.json({
      success: false,
      msg: "Username or password is incorrect",
    });
  }),

  me: publicProcedure.query(async ({ c }) => {
    await connectToDb();
    const token = getCookie(c, "token");
    const { id } = jwt.decode(token) as { id: string };
    const user = await User.findById(id).select("-password");

    if (!user) {
      return c.json({
        success: false,
        user: null,
        msg: "User not found",
      });
    }

    return c.json({
      success: true,
      user,
      msg: "User found",
    });
  }),

  getLoggedInUserPosts: publicProcedure
    .input(z.object({ isPublic: z.boolean().default(true) }))
    .mutation(async ({ c, input }) => {
      await connectToDb();
      const { isPublic } = input;
      const { success, user, msg } = auth(c);
      if (!success) {
        return c.json({
          success: false,
          msg,
          posts: [],
        });
      }

      const posts = await Post.find({ user: user, isPublic: isPublic }).select(
        "image"
      );

      return c.json({
        success: true,
        msg: "Posts found",
        posts,
      });
    }),

  getUserPosts: publicProcedure
    .input(z.object({ isPublic: z.boolean().default(true), id: z.string() }))
    .mutation(async ({ c, input }) => {
      await connectToDb();
      const { isPublic, id } = input;

      const posts = await Post.find({ user: id, isPublic: isPublic }).select(
        "image"
      );

      return c.json({
        success: true,
        msg: "Posts found",
        posts,
      });
    }),

  getUserLikedPosts: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, c }) => {
      await connectToDb();
      const { id } = input;
      const posts = await Post.find({
        likes: { $in: [id] },
        isPublic: true,
      });

      return c.json({
        success: true,
        posts,
      });
    }),
  search: publicProcedure
    .input(z.object({ search: z.string() }))
    .query(async ({ input, c }) => {
      await connectToDb();
      const { success, msg, user } = auth(c);

      if (!success) {
        return c.json({ success: false, msg: "Unauthorized", users: [] });
      }

      const usernameRegex = new RegExp(input.search, "i");

      const users = await User.find({ username: { $regex: usernameRegex } });

      if (!users) {
        return c.json({ success: false, msg: "No users found", users: [] });
      }

      return c.json({ success: true, msg: "Users found", users });
    }),

  getAllUsers: publicProcedure.query(async ({ c }) => {
    await connectToDb();
    const users = await User.find();

    return c.json({
      success: true,
      msg: "Users found",
      users,
    });
  }),

  addFriend: publicProcedure
    .input(AddFriendSchema)
    .mutation(async ({ input, c }) => {
      const { from, userId, type, fromAvatar } = input;

      await Notifications.create({
        from: from,
        to: userId,
        fromAvatar: fromAvatar,
        notificationType: type,
      });

      return c.json({
        success: true,
      });
    }),

  checkFriend: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, c }) => {
      const { user: userId, success, msg } = auth(c);

      const { id } = input;

      if (!success) {
        return c.json({
          success,
          msg,
        });
      }

      const user = await User.findById(id);

      if (user.friends.includes(userId)) {
        return c.json({
          success: true,
        });
      } else {
        return c.json({
          success: false,
        });
      }
    }),

  getUserById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, c }) => {
      const user = await User.findById(input.id);

      return c.json({
        success: true,
        user,
      });
    }),
});
