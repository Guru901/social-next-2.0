import { client } from "./client";

export const handleLike = async (id: string, refetch: () => void) => {
  try {
    await client.post.like.$post({ id });
    refetch();
  } catch (error) {
    console.log(error);
    return "An error occurred. Try logging in again.";
  }
};

export const handleUnLike = async (id: string, refetch: () => void) => {
  try {
    await client.post.unlike.$post({ id });
    refetch();
  } catch (error) {
    console.log(error);
    return "An error occurred. Try logging in again.";
  }
};

export const handleDisLike = async (id: string, refetch: () => void) => {
  try {
    await client.post.dislike.$post({ id });
    refetch();
  } catch (error) {
    console.log(error);
    return "An error occurred. Try logging in again.";
  }
};

export const handleDisUnlike = async (id: string, refetch: () => void) => {
  try {
    await client.post.disunlike.$post({ id });
    refetch();
  } catch (error) {
    console.log(error);
    return "An error occurred. Try logging in again.";
  }
};
