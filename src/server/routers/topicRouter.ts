import { connectToDb } from "../db/connect";
import auth from "../helper/auth";
import { j, privateProcedure, publicProcedure } from "../jstack";
import Topic from "../models/topicModel";
import { z } from "zod";
import User from "../models/userModel";

export const topicRouter = j.router({
  getAllTopics: publicProcedure.query(async ({ c }) => {
    await connectToDb();
    const topics = await Topic.find({});
    return c.json({
      success: true,
      msg: "Topics found",
      topics,
    });
  }),
  createTopic: privateProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ c, input }) => {
      await connectToDb();
      const { success, user, msg } = auth(c);
      if (!success) return c.json({ success, msg });
      const loggedInUser = await User.findById(user);
      const { name } = input;

      const topic = await Topic.create({
        name: name,
        createdBy: loggedInUser.username,
      });

      return c.json({
        success: true,
        msg: "Topic created",
        topic,
      });
    }),
});
