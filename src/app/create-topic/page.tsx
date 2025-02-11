import { createTopic } from "@/actions/actions";
import Nav from "@/app/components/Nav";
import Submit from "./submit";

export default function CreateTopic() {
  return (
    <div className="flex flex-col h-screen gap-24">
      <Nav />
      <div className="flex flex-col gap-20 justify-center items-center">
        <h1 className="text-[currentColor] text-3xl text-center">
          Create A Custom Topic!!
        </h1>
        <form
          className="flex flex-col gap-2 px-4 justify-center items-center"
          action={createTopic}
        >
          <input
            type="text"
            name="title"
            className="input input-bordered w-[calc(100vw-16px)] max-w-96"
            placeholder="Title of Topic.."
          />
          <Submit />
        </form>
      </div>
    </div>
  );
}
