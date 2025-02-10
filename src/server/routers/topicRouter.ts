import { connectToDb } from "../db/connect";
import auth from "../helper/auth";
import { j, publicProcedure } from "../jstack";
import Topic from "../models/topicModel";

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
});
