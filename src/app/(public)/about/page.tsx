import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="bg-gray-900 text-white py-10 px-3 sm:py-12 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-8 sm:gap-12">
        <div className="flex flex-col md:flex-row gap-8 sm:gap-10 items-start">
          <div className="md:w-1/2 w-full mb-6 md:mb-0 flex justify-center">
            <Image
              src="/images/knives/7560d7e117410fb63ca30d935819f9ea05d7eaf5.png"
              alt="Couteau artisanal Xulinos"
              width={700}
              height={400}
              className="rounded-md object-cover w-full max-w-[400px] sm:max-w-[700px] h-auto"
            />
          </div>

          <div className="md:w-1/2 w-full space-y-4 sm:space-y-6 text-base sm:text-sm leading-relaxed">
            <h2 className="text-lg sm:text-xl font-semibold">À propos – Xulinos</h2>

            <div>
              <h3 className="font-bold mb-1">
                Un artisanat enraciné dans la matière et le sens
              </h3>
              <p>
                Chez Xulinos, chaque couteau raconte une histoire. Une histoire de mains, de gestes, de matière, et surtout de convictions.
                Damien Momper, artisan coutelier passionné, fabrique chaque pièce à la main dans son atelier, avec exigence, patience et respect de la matière.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-1">
                Une démarche éthique et responsable
              </h3>
              <p>
                Xulinos, ce n'est pas seulement un savoir-faire, c'est aussi un engagement : donner une seconde vie à des matériaux destinés à disparaître.
                Damien récupère des chutes de bois précieuses provenant d'ateliers d'ébénistes ou de luthiers.
              </p>
              <p>
                Ces fragments, trop petits pour l'industrie, sont pourtant porteurs de caractère et d'histoire. Il les transforme en manches de couteaux uniques, durables, et porteurs de sens.
              </p>
              <p>
                Rien n'est standardisé, rien n'est gaspillé. Chaque essence de bois, chaque nervure est valorisée. Cet ancrage dans l'économie circulaire donne à chaque création un supplément d'âme.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 sm:gap-10 items-start mt-8">
          <div className="md:w-1/2 w-full space-y-4 sm:space-y-6 text-base sm:text-sm leading-relaxed">
            <div>
              <h3 className="font-bold mb-1">Un nom, une identité : Xulinos</h3>
              <p>
                "Xulinos" vient du grec ancien ξύλινος (xýlinos), qui signifie "fait de bois".
                Ce nom incarne pleinement l'esprit du projet : une fusion entre le matériau naturel et la main de l'artisan.
                Un mot simple, organique, qui évoque l'authenticité, la matière brute, le lien entre l'humain et le vivant.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-1">Une évolution visuelle, fidèle à l'atelier</h3>
              <p>
                Le logo original de Xulinos avait été esquissé à la main par Damien lui-même. Un symbole brut, presque gravé, qui évoquait l'artisanat pur et la matière.
                Lors de la refonte de l'identité visuelle, nous avons tenu à préserver cette intention :
              </p>
              <ul className="list-disc list-inside">
                <li>
                  La nouvelle version du logo reprend l'idée de l'empreinte, du trait ciselé, inspiré des outils de l'atelier.
                </li>
                <li>
                  La typographie a été retravaillée pour gagner en lisibilité, tout en conservant une touche artisanale et naturelle.
                </li>
              </ul>
              <p>
                Cette évolution respecte les racines du projet tout en affirmant une identité visuelle plus claire, plus pérenne, à l'image du travail de Damien.
              </p>
            </div>
          </div>

          <div className="md:w-1/2 w-full flex justify-center items-center gap-4 sm:gap-6 flex-wrap mt-6 md:mt-0">
            <Image
              src=""
              alt="Logos Xulinos"
              width={350}
              height={350}
              className="object-contain w-40 h-40 sm:w-[350px] sm:h-[350px]"
            />
            <Image
                src=""
                alt="logo Xulinos"
                width={350}
                height={350}
                className="object-contain w-40 h-40 sm:w-[350px] sm:h-[350px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
