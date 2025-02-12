export function getDateDifference(dateString: string) {
  try {
    if (!dateString) {
      return "Long time ago";
    }
    const postDate = new Date(dateString);
    const currentDate = new Date();

    const timeDifference = Number(currentDate) - Number(postDate);

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days >= 7) {
      return postDate.toDateString();
    } else if (days >= 1) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours >= 1) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes >= 1) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return "Just Now";
    }
  } catch (error) {
    console.error(error);
    return "Long time ago";
  }
}
