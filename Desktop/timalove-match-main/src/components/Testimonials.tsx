import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Awa & Moussa",
    role: "Mariés depuis 6 mois",
    content: "Grâce à TimaLove, nous avons trouvé bien plus qu'un partenaire, nous avons trouvé une vision commune du mariage. L'accompagnement humain fait toute la différence.",
    avatar: "❤"
  },
  {
    id: 2,
    name: "Khady",
    role: "Membre vérifiée",
    content: "Le sérieux des profils est rassurant. On sent que chaque personne est là avec une intention réelle de construire. Je recommande à 100%.",
    avatar: "❤"
  },
  {
    id: 3,
    name: "Ibrahima",
    role: "Membre vérifié",
    content: "Une approche respectueuse de nos valeurs. C'est la première fois que je me sens écouté et compris dans ma recherche.",
    avatar: "❤"
  }
];

export const Testimonials = () => {
  return (
    <section id="temoignages" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        
        {/* Header de la section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-sm uppercase tracking-[0.3em] text-primary font-bold mb-4">
            Témoignages
          </h2>
          <p className="font-serif text-4xl md:text-5xl text-slate-800 mb-6 italic">
            Ils ont trouvé <span className="text-primary">l'amour</span> avec nous
          </p>
          <div className="w-24 h-1 bg-primary/20 mx-auto rounded-full" />
        </div>

        {/* Grille d'avis créative */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          
          {/* Décoration de fond (Cercle rose flou) */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
          
          {testimonials.map((testi) => (
            <div 
              key={testi.id} 
              className="bg-[#FFF5F5] p-8 rounded-[40px] border border-white shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 relative group"
            >
              {/* Icône de citation stylisée */}
              <div className="absolute -top-4 -left-2 bg-primary text-white p-3 rounded-2xl shadow-lg rotate-12 group-hover:rotate-0 transition-transform">
                <Quote size={20} fill="currentColor" />
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-primary text-primary" />
                ))}
              </div>

              <p className="text-slate-700 leading-relaxed mb-8 italic font-light text-lg">
                "{testi.content}"
              </p>

              <div className="flex items-center gap-4 border-t border-primary/10 pt-6">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary border border-primary/20 font-bold shadow-inner">
                  {testi.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{testi.name}</h4>
                  <p className="text-xs text-primary/70 font-medium uppercase tracking-widest">
                    {testi.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action discret pour ajouter un avis */}
        <div className="mt-20 text-center">
          <div className="inline-block p-[1px] rounded-full bg-gradient-to-r from-transparent via-primary/20 to-transparent w-full max-w-xl mb-8" />
          <p className="text-slate-500 mb-6">Vous avez trouvé votre moitié via TimaLove ?</p>
          <button className="text-primary font-serif italic text-xl hover:underline underline-offset-8 transition-all">
            Partagez votre histoire avec nous →
          </button>
        </div>
      </div>
    </section>
  );
};