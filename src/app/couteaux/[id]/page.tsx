import { knives } from "@/utils/knivesData";
import KnifeDetail from "@/app/couteauxDetails/page";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string }
}

export default async function KnifeDetailPage({ params }:any) {
  const {id} = await params;
  const knife = knives.find((k) => k.id === Number(id));

  if (!knife) {
    notFound();
  }

  return (
    <KnifeDetail
      name={knife.name}
      price={knife.price}
      available={knife.available}
      description={knife.description}
      mainImage={knife.mainImage}
      gallery={knife.gallery}
    />
  );
} 