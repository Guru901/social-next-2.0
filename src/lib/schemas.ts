import { z } from "zod";

export const SignUpSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    avatar: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const LoginSchema = z.object({
  username: z.string().min(1, "Username can't be empty"),
  password: z.string().min(1, "Password can't be empty"),
});

export const PostSchema = z.object({
  title: z.string().min(3),
  body: z.string().min(3),
  image: z.string().optional(),
  isPublic: z.boolean().default(true),
  username: z.string().optional(),
  topic: z.string().default("general"),
});

export const CommentSchema = z.object({
  comment: z.string(),
  postId: z.string(),
  image: z.string().optional(),
  username: z.string(),
  avatar: z.string().optional(),
  replyTo: z.string().optional(),
});

export const AddFriendSchema = z.object({
  from: z.string(),
  userId: z.string(),
  fromAvatar: z.string().optional(),
  type: z.string(),
});
