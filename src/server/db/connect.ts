import mongoose, { connections } from "mongoose";
import { initModels } from "./initModels";

export const connectToDb = async () => {
  try {
    if (connections[0]?.readyState) {
      return;
    }
    await mongoose.connect(process.env.MONGO_URI!);
    await initModels();
  } catch (error) {
    return error;
  }
};
