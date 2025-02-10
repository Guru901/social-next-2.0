const PostItems = [
  {
    lable: "General",
    selectedOption: "general",
  },
  {
    lable: "Friends",
    selectedOption: "friends",
  },
  {
    lable: "All Posts",
    selectedOption: "all_posts",
  },
];

export function FetchOptions({ selectedOption, setSelectedOption }) {
  return (
    <div className="join w-[15rem]">
      {PostItems.map((postItem) => (
        <input
          key={postItem.lable}
          className="join-item btn w-[33%] p-1 h-min"
          name="options"
          type="radio"
          aria-label={postItem.lable}
          checked={selectedOption === postItem.selectedOption}
          onChange={() => setSelectedOption(postItem.selectedOption)}
        />
      ))}
    </div>
  );
}
