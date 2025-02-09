import { jstack } from "jstack";

interface Env {
  Bindings: {};
}

export const j = jstack.init<Env>();

export const publicProcedure = j.procedure;
