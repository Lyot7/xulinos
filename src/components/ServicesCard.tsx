import Link from "next/link";

type ServiceCardProps = {
  image: string;
  title: string;
  description: string;
  tags: string[];
  selected: boolean;
  onToggle: () => void;
  showButton?: boolean;
  slug?: string;
};

export default function ServiceCard({
  image,
  title,
  description,
  tags,
  selected,
  onToggle,
  showButton,
  slug,
}: ServiceCardProps) {
  return (
    <div
      onClick={onToggle}
      className={`cursor-pointer bg-[#1f1f1f] border rounded-xl p-4 flex flex-col w-full max-w-xs min-h-[350px] transition 
        ${selected ? "border-white shadow-lg" : "border-white/20 hover:border-white/40"}`}
    >
      <img
          src={image}
          alt="Services image"
          className="h-32 rounded mb-4"
        />
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-300 mb-4 line-clamp-5">{description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag) => (
          <span key={tag} className="bg-[#2e2e2e] text-xs px-2 py-1 rounded">
            {tag}
          </span>
        ))}
      </div>

      {showButton && slug && (
        <div className="mt-auto flex justify-center">
          <Link href={`/${slug}`}>
            <button
              onClick={(e) => e.stopPropagation()}
              className="border border-white/40 hover:bg-sage transition text-sm px-4 py-2 rounded-full flex items-center gap-2"
            >
              En savoir plus
              <img
                src="/icons/external_link.svg"
                alt="external link"
                width={16}
                height={16}
              />
            </button>
          </Link>
        </div>
      )}

    </div>
  );
}
