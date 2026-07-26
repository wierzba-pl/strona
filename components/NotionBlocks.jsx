import Image from "next/image";

export default function NotionBlocks({ blocks }) {
  if (!blocks?.length) return null;

  return (
    <div className="prose-like">
      {blocks.map((block) => {
        if (block.type === "heading_2") {
          return (
            <h2 key={block.id} className="display-title mt-12 text-3xl">
              {block.text}
            </h2>
          );
        }
        if (block.type === "heading_3") {
          return (
            <h3 key={block.id} className="mt-8 font-mono text-sm uppercase tracking-[0.08em] text-accent">
              {block.text}
            </h3>
          );
        }
        if (block.type === "bulleted_list_item") {
          return (
            <li key={block.id} className="ml-5 list-disc text-inkSoft">
              {block.text}
            </li>
          );
        }
        if (block.type === "to_do") {
          return (
            <label key={block.id} className="my-2 flex items-start gap-3 text-inkSoft">
              <input type="checkbox" defaultChecked={block.checked} className="mt-1 accent-[#D4291B]" />
              <span>{block.text}</span>
            </label>
          );
        }
        if (block.type === "image" && block.url) {
          return (
            <div key={block.id} className="relative my-8 aspect-[4/3] overflow-hidden rounded-ui bg-black">
              <Image src={block.url} alt={block.caption || ""} fill className="object-cover" sizes="100vw" />
            </div>
          );
        }
        return block.text ? (
          <p key={block.id} className="my-4 text-inkSoft">
            {block.text}
          </p>
        ) : null;
      })}
    </div>
  );
}
