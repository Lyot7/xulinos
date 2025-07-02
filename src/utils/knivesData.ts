export type Knife = {
  id: number;
  name: string;
  price: number;
  available: boolean;
  description: string;
  mainImage: string;
  gallery: string[];
};

export const knives: Knife[] = [
  {
    id: 1,
    name: "Le Souverain",
    price: 250,
    available: true,
    description: "Bois de fer, lame en acier poli, pliant.\nUn couteau d'exception pour les connaisseurs.",
    mainImage: "/images/knives/le-souverain/le-souverain.png",
    gallery: [
      "/images/knives/7560d7e117410fb63ca30d935819f9ea05d7eaf5.png"
    ]
  },
  {
    id: 2,
    name: "Kiridashi 'Yoru'",
    price: 180,
    available: false,
    description: "Bois d'ébène, acier damas.\nUn design japonais traditionnel.",
    mainImage: "/images/knives/kiridashi-yoru/kiridashi-yoru.png",
    gallery: [
      "/images/knives/7560d7e117410fb63ca30d935819f9ea05d7eaf5.png"
    ]
  },
  {
    id: 3,
    name: "Le Damas sylvestre",
    price: 320,
    available: true,
    description: "Bois de santal, acier carbone, guillochage.\nUn couteau unique pour les amateurs de belles lames.",
    mainImage: "/images/knives/le_damas_sylvestre/01.png",
    gallery: [
      "/images/knives/le_damas_sylvestre/01.png",
      "/images/knives/le_damas_sylvestre/02.png",
      "/images/knives/le_damas_sylvestre/03.png",
      "/images/knives/le_damas_sylvestre/04.png",
      "/images/knives/le_damas_sylvestre/05.png",
      "/images/knives/le_damas_sylvestre/06.png"
    ]
  }
]; 