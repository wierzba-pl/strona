import Link from "next/link";
import VideoPlayer from "@/components/VideoPlayer";

export default function CaseCard({ item }) {
  return (
    <article className="paper-card overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg">
      <VideoPlayer src={item.videoUrl} title={item.title} aspect="aspect-[4/5]" />
      <div className="p-5">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {item.categories.map((category) => (
            <span className="tag" key={category}>
              {category}
            </span>
          ))}
        </div>
        <h2 className="display-title mb-2 text-xl">{item.title}</h2>
        {item.client ? (
          <div className="mb-4 font-mono text-xs text-inkFaint">Klient: {item.client}</div>
        ) : null}
        <Link href={`/portfolio/${item.slug}`} className="cta-button secondary w-full">
          Zobacz więcej
        </Link>
      </div>
    </article>
  );
}
