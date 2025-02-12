import { Context } from "hono";
import { getCookie } from "hono/cookie";
import jwt from "jsonwebtoken";

export default function auth(c: Context) {
  try {
    const token = getCookie(c, "token");
    if (!token) {
      return {
        success: false,
        msg: "User not logged in",
        user: null,
      };
    }

    const { id } = jwt.decode(token) as { id: string };

    if (!id) {
      return {
        success: false,
        msg: "User not logged in",
        user: null,
      };
    }

    return {
      success: true,
      user: id,
      msg: "User logged in",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      msg: "User not logged in",
      user: null,
    };
  }
}
