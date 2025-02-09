import { j, publicProcedure } from "../jstack";
import { SignUpSchema } from "@/lib/schemas";

export const userRouter = j.router({
  register: publicProcedure
    .input(SignUpSchema)
    .mutation(async ({ input, c }) => {}),
});
