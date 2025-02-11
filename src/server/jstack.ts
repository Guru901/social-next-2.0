import { jstack } from "jstack";
import auth from "./helper/auth";
import { HTTPException } from "hono/http-exception";

interface Env {
  Bindings: {
    MONGO_URI: string;
    TOKEN_SECRET: string;
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: string;
  };
}

export const j = jstack.init<Env>();

export const authMiddleware = j.middleware(async ({ c, next }) => {
  const { success, user } = auth(c);
  if (!success) {
    throw new HTTPException(401, {
      message: "Unauthorized, sign in to continue.",
    });
  }
  return await next({ auth: user });
});

export const publicProcedure = j.procedure;
export const privateProcedure = j.procedure.use(authMiddleware);
