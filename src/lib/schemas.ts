import { z } from "zod";

export const SignUpSchema = z
  .object({
    username: z.string().min(3),
    password: z.string().min(6),
    confirmPassword: z.string(),
    avatar: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const LoginSchema = z.object({
  username: z.string(),
  password: z.string(),
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
