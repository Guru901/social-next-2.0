import { jstack } from "jstack";

interface Env {
  Bindings: {
    MONGO_URI: string;
    TOKEN_SECRET: string;
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: string;
  };
}

export const j = jstack.init<Env>();

export const publicProcedure = j.procedure;
