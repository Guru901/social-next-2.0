import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
    },

    avatar: String,

    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    isFriendsWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    banner: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
export { userSchema };
