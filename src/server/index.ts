import { j } from "./jstack";
import { postRouter } from "./routers/postRouter";
import { topicRouter } from "./routers/topicRouter";
import { userRouter } from "./routers/userRouter";

const api = j
  .router()
  .basePath("/api")
  .use(j.defaults.cors)
  .onError(j.defaults.errorHandler);

const appRouter = j.mergeRouters(api, {
  user: userRouter,
  post: postRouter,
  topic: topicRouter,
});

export type AppRouter = typeof appRouter;

export default appRouter;
