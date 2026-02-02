import { Footer } from "@/components/Footer";
import { MemberGallery } from "@/components/MemberGallery";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Bell, Filter, Loader2, Search, User } from "lucide-react";
import { useEffect, useState } from "react";

const UserProfile = () => {
  const [userSexe, setUserSexe] = useState<'homme' | 'femme'>('femme');
  const [hasPaid, setHasPaid] = useState(userSexe === 'femme');
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setHasPaid(userSexe === 'femme');
  }, [userSexe]);

  return (
    <div className="min-h-screen bg-[#FDFBFB]">
      <Navbar />
      
      {/* HEADER DE NAVIGATION & FILTRES */}
      <div className="pt-20 pb-4 bg-white/95 backdrop-blur-md border-b border-rose-100 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 space-y-4">
          <div className="flex items-center gap-4">
            {/* Barre de Recherche */}
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 flex-1 max-w-lg">
              <Search size={18} className="text-slate-400" />
              <input type="text" placeholder="Rechercher un profil..." className="bg-transparent border-none outline-none text-sm w-full" />
            </div>

            <div className="hidden md:flex items-center gap-4 ml-auto">
               <button className="relative p-2 text-slate-400 hover:text-primary transition-colors">
                  <Bell size={24} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
               </button>
               <div className="flex items-center gap-2 pl-4 border-l border-slate-100">
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center text-primary border border-rose-100">
                    <User size={20} />
                  </div>
               </div>
            </div>
          </div>

          {/* BARRE DE FILTRES (Style Farata) */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
            <Button variant="outline" className="rounded-xl border-slate-200 gap-2 h-9 text-xs font-bold text-slate-600">
              <Filter size={14} /> Filtres
            </Button>
            <div className="h-6 w-[1px] bg-slate-200" />
            {["Pays", "Célibataire", "18-25", "26-35", "36+"].map((f) => (
              <button key={f} className="px-4 py-2 bg-white border border-slate-100 rounded-full text-[11px] font-bold text-slate-500 hover:border-primary transition-all whitespace-nowrap shadow-sm">
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="py-8 container mx-auto px-4">
        {/* Rappel du système de défloutage pour les hommes [cite: 27, 28] */}
        {userSexe === 'homme' && !hasPaid && (
          <div className="mb-10 bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl font-serif mb-2 text-rose-200">Accès Premium (50 € / 32 800 FCFA)</h2>
              <p className="text-slate-400 text-sm font-light">Le défloutage des photos est conditionné au paiement sécurisé. [cite: 28, 29]</p>
            </div>
            <Button onClick={() => setHasPaid(true)} className="bg-primary text-white h-12 px-10 rounded-2xl font-bold shadow-lg shadow-primary/20 relative z-10">
              Débloquer la galerie
            </Button>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-serif text-slate-900">
            Profils {userSexe === 'femme' ? 'masculins' : 'féminins'}
          </h1>
          <span className="text-[10px] font-bold bg-green-50 text-green-700 px-3 py-1.5 rounded-xl border border-green-100 uppercase tracking-widest">
            Service Vérifié [cite: 5]
          </span>
        </div>

        <MemberGallery 
          forceShowNet={hasPaid} 
          limit={visibleCount} 
          targetSexe={userSexe === 'femme' ? 'homme' : 'femme'} 
        />

        <div className="mt-16 text-center">
          <Button 
            onClick={() => {
              setLoading(true);
              setTimeout(() => { setVisibleCount(v => v + 5); setLoading(false); }, 800);
            }} 
            variant="outline" 
            className="rounded-full px-16 h-14 border-rose-200 text-primary font-bold shadow-sm"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : "Afficher plus de résultats"}
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;