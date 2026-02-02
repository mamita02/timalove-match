import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuiSuisJe = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-20">
        {/* Section avec fond ROSE PÂLE uniforme */}
        <section className="relative w-full min-h-[90vh] lg:h-[95vh] overflow-hidden bg-[#FFF5F5]">
          
          {/* IMAGE DE DROITE : Taille réduite et centrée verticalement */}
          <div className="absolute inset-y-0 right-0 w-full lg:w-1/2 flex items-center justify-end pr-4 lg:pr-12 pointer-events-none">
            <img 
              src="src/assets/A PROPOS1Plan de travail 5.png" 
              alt="Fatimata Ba - TimaLove" 
              className="w-auto h-[60%] lg:h-[75%] object-contain opacity-90" 
            />
          </div>

          <div className="container mx-auto h-full px-4 relative z-10 flex items-center">
            
            {/* BOX TEXTE : Toujours à gauche, largeur optimale */}
            <div className="w-full lg:w-[42%] flex flex-col gap-4 py-12 lg:py-0">
              
              <Button 
                variant="ghost" 
                onClick={() => navigate("/")} 
                className="w-fit text-primary bg-white/60 backdrop-blur-md hover:bg-primary hover:text-white mb-2 shadow-sm rounded-full"
              >
                <ArrowLeft className="mr-2" size={18} /> Retour
              </Button>

              <div className="bg-white/80 backdrop-blur-xl text-slate-800 p-8 md:p-12 rounded-[40px] shadow-xl border border-white">
                <h1 className="text-3xl md:text-4xl font-serif mb-2 text-primary leading-tight">
                  À propos de <span className="italic">TIMA</span>
                </h1>
                <div className="w-16 h-1 bg-primary/30 mb-6" />

                {/* Zone de texte scrollable */}
                <div className="max-h-[400px] overflow-y-auto pr-4 custom-scrollbar space-y-6 text-slate-700 text-base md:text-lg leading-relaxed">
                  <p className="text-primary font-medium italic text-xl">
                    "Je m’appelle Fatimata, que beaucoup appellent Tima."
                  </p>
                  
                  <p>
                    TimaLove est né d’une conviction simple mais profonde : l’amour mérite d’être vécu avec sincérité, respect et intention.
                  </p>

                  <p>
                    Depuis toujours, j’aime écouter, aider et comprendre les autres. Je prends le temps d’entendre ce qui est dit… mais aussi ce qui ne l’est pas.
                  </p>

                  <h2 className="text-xl font-serif text-primary pt-2 italic underline underline-offset-8 decoration-primary/20">
                    Une histoire humaine
                  </h2>
                  <p>
                    Je suis née dans une famille nombreuse... Grandir dans cet environnement m’a appris une chose : aimer, ce n’est pas seulement ressentir, c’est comprendre.
                  </p>

                  <h2 className="text-xl font-serif text-primary pt-2 italic underline underline-offset-8 decoration-primary/20">
                    La naissance de TimaLove
                  </h2>
                  <p>
                    TimaLove est né du besoin de créer un espace où l’on prend le temps. Où chaque personne est respectée et chaque rencontre réfléchie.
                  </p>

                  <div className="bg-[#FFF5F5] p-6 rounded-3xl border border-primary/10">
                    <h3 className="text-primary font-bold mb-3 uppercase tracking-widest text-[10px]">Ma Vision</h3>
                    <ul className="space-y-2 text-sm md:text-base">
                      <li className="flex items-center gap-3">
                        <span className="text-primary">❤</span> L’amour avec intention
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="text-primary">❤</span> La communication essentielle
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="text-primary">❤</span> Le respect comme base
                      </li>
                    </ul>
                  </div>

                  <p className="pt-4 font-serif text-lg text-primary/80 italic border-t border-primary/10">
                    TimaLove, c’est une main tendue vers ceux qui veulent construire avec le cœur.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />

      {/* Correction de l'erreur ici : suppression de l'attribut jsx */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5B5B5; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default QuiSuisJe;