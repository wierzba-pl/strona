import Image from "next/image";
import Link from "next/link";

export default function PostCard({ post }) {
  return (
    <article className="paper-card overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[16/10] bg-black">
          {post.coverUrl ? (
            <Image src={post.coverUrl} alt="" fill className="object-cover" sizes="(min-width: 1024px) 33vw, 100vw" />
          ) : (
            <div className="flex h-full items-end p-4 font-mono text-xs uppercase tracking-[0.08em] text-white/45">
              miejsce na okładkę artykułu
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {post.categories.map((category) => (
              <span className="tag" key={category}>
                {category}
              </span>
            ))}
          </div>
          <h2 className="display-title mb-3 text-xl leading-tight">{post.title}</h2>
          {post.excerpt ? <p className="mb-4 text-sm text-inkSoft">{post.excerpt}</p> : null}
          <div className="font-mono text-xs text-inkFaint">
            {post.publishedAt ? new Intl.DateTimeFormat("pl-PL").format(new Date(post.publishedAt)) : "Artykuł"}
          </div>
        </div>
      </Link>
    </article>
  );
}
