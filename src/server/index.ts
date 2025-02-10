import { j } from "./jstack";
import { postRouter } from "./routers/posrRouter";
import { userRouter } from "./routers/userRouter";

const api = j
  .router()
  .basePath("/api")
  .use(j.defaults.cors)
  .onError(j.defaults.errorHandler);

const appRouter = j.mergeRouters(api, {
  user: userRouter,
  post: postRouter,
});

export type AppRouter = typeof appRouter;

export default appRouter;
