import Image from "next/image";

export default async function Memes() {
  const response = await fetch("https://meme-api.com/gimme");
  const data = (await response.json()) as { author: string; url: string };

  return (
    <div className="flex flex-col gap-4">
      <p className="px-3">Reload for another meme</p>
      <div className="flex flex-col justify-start items-center h-screen">
        <Image
          width={500}
          height={200}
          src={data.url}
          alt="meme"
          className="max-w-[100svw] w-100vw max-h-[90vh] "
        />
        <h1>Author - {data.author}</h1>
      </div>
    </div>
  );
}
