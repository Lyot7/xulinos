import { knives } from "@/utils/knivesData";
import KnifeDetail from "@/components/KnifeDetail";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function KnifeDetailPage({ params }: Props) {
  const {id} = await params;
  const knife = knives.find((k) => k.id === Number(id));

  if (!knife) {
    notFound();
  }

  return (
    <KnifeDetail
      id={knife.id.toString()}
      name={knife.name}
      price={knife.price}
      available={knife.available}
      description={knife.description}
      mainImage={knife.mainImage}
      gallery={knife.gallery}
    />
  );
} 