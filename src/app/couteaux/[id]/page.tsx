import KnifeDetail from "@/components/KnifeDetail";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

export default async function KnifeDetailPage({ params }: Props) {
  const { id } = await params;

  const res = await fetch(`https://xulinos.xyz-agency.com/wp-json/wp/v2/couteaux/${id}?_embed`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    notFound(); // ou gestion d'erreur
  }

  const knife = await res.json();

  return (
    <KnifeDetail
      id={knife.id.toString()}
      name={knife.title?.rendered}
      price={knife.acf?.prix || "—"}
      available={knife.class_list?.includes("couteaux_tag-disponible-a-lachat") || false}
      description={knife.content?.rendered}
      mainImage={knife._embedded?.["wp:featuredmedia"]?.[0]?.source_url || ""}
      gallery={[]}
    />
  );
}
