import { j, privateProcedure, publicProcedure } from "../jstack";
import { AddFriendSchema, LoginSchema, SignUpSchema } from "@/lib/schemas";
import User from "../models/userModel";
import { connectToDb } from "../db/connect";
import jwt from "jsonwebtoken";
import { setCookie } from "hono/cookie";
import { z } from "zod";
import auth from "../lib/auth";
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

  me: privateProcedure.query(async ({ c, ctx }) => {
    await connectToDb();
    const user = await User.findById(ctx.auth).select("-password");

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

  getLoggedInUserPosts: privateProcedure
    .input(z.object({ isPublic: z.boolean().default(true) }))
    .mutation(async ({ c, input, ctx }) => {
      await connectToDb();
      const { isPublic } = input;

      const posts = await Post.find({
        user: ctx.auth,
        isPublic: isPublic,
      }).select("image");

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

  checkFriend: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, c, ctx }) => {
      const { id } = input;

      const user = await User.findById(id);

      if (user.friends.includes(ctx.auth)) {
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
      await connectToDb();

      const id = input.id.split("_").join(" ");

      let user = await User.findOne({
        username: { $regex: new RegExp("^" + id + "$", "i") },
      });

      if (!user) {
        user = await User.findById(id).select("-password");
      }

      if (!user) {
        return c.json({
          msg: "User not found",
          success: false,
          user: {},
        });
      }

      return c.json({
        success: true,
        user,
      });
    }),

  logout: publicProcedure.query(async ({ c }) => {
    setCookie(c, "token", "");

    return c.json({
      success: true,
    });
  }),

  getFriends: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ c, input }) => {
      await connectToDb();

      const loggedInUser = await User.findById(input.userId);
      const friends = loggedInUser.friends;

      const friendsData = await Promise.all(
        friends.map(async (x) => {
          const friend = await User.findById(x);
          return friend;
        })
      );

      return c.json({
        success: true,
        msg: "Friends found",
        friendsData,
      });
    }),

  getNotifications: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ c, input }) => {
      await connectToDb();

      const notifications = await Notifications.find({
        to: input.userId,
        isAccepted: false,
      });

      return c.json({
        success: true,
        msg: "Notifications found",
        notifications,
      });
    }),

  acceptNotification: privateProcedure
    .input(
      z.object({
        notificationType: z.string(),
        from: z.string(),
        notificationId: z.string(),
      })
    )
    .mutation(async ({ input, c, ctx }) => {
      await connectToDb();
      const { notificationType, from, notificationId } = input;

      if (notificationType === "friendAdd") {
        const fromUser = await User.findOne({ username: from });
        const toUser = await User.findById(ctx.auth);

        if (!fromUser || !toUser) {
          return c.json({ msg: "User not found" });
        }

        if (toUser.friends.includes(fromUser._id.toString())) {
          return c.json({ msg: "Already friends" });
        }

        toUser.friends.push(fromUser._id);
        await toUser.save();

        fromUser.friends.push(toUser._id);
        await fromUser.save();

        const noitification = await Notifications.findById(notificationId);

        noitification.isAccepted = true;
        noitification.isSeen = true;

        await noitification.save();

        const updatedFriends = toUser.friends;
        return c.json(updatedFriends);
      }
    }),

  editAvatar: privateProcedure
    .input(z.object({ avatar: z.string() }))
    .mutation(async ({ input, c, ctx }) => {
      await connectToDb();

      const { avatar } = input;

      const userToUpdate = await User.findById(ctx.auth);

      if (userToUpdate._id !== ctx.auth) {
        return c.json({
          success: false,
          msg: "Unauthorized",
        });
      }

      userToUpdate.avatar = avatar;

      await userToUpdate.save();

      return c.json({
        success: true,
        msg: "Avatar updated successfully",
      });
    }),

  changePassword: privateProcedure
    .input(
      z.object({
        oldPass: z.string(),
        newPass: z.string(),
      })
    )
    .mutation(async ({ input, c, ctx }) => {
      await connectToDb();

      const loggedInUser = await User.findById(ctx.auth);
      const { oldPass, newPass } = input;

      if (oldPass !== loggedInUser.password) {
        const response = c.json({
          msg: "Old password does not match.",
          success: false,
        });
        return response;
      }

      loggedInUser.password = newPass;

      await loggedInUser.save();
      return c.json({
        success: true,
        msg: "Password changed successfully",
      });
    }),
});
