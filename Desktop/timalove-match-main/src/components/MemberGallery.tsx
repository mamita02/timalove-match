import { supabase } from "@/lib/supabase";
import { Briefcase, Heart, Loader2, Lock, MapPin, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

interface MemberGalleryProps {
  forceShowNet: boolean; // Géré par le statut payant/sexe dans UserProfile
  limit: number;         // Pour le système "Voir plus"
  targetSexe: 'homme' | 'femme';
}

export const MemberGallery = ({ forceShowNet, limit, targetSexe }: MemberGalleryProps) => {
  const navigate = useNavigate();
  
  // États pour les données réelles et le chargement
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Récupération des données depuis Supabase
  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      
      // Correspondance avec les valeurs en base de données
      const dbGender = targetSexe === 'femme' ? 'female' : 'male';

      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .eq('gender', dbGender)
        .eq('status', 'approved') // Filtre les profils validés
        .limit(limit);

      if (!error && data) {
        setMembers(data);
      }
      setLoading(false);
    };

    fetchProfiles();
  }, [targetSexe, limit]);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  const handleDemande = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Demande envoyée à l'administratrice");
  };

  // Affichage d'un loader pendant le chargement initial
  if (loading && members.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-primary/50" size={32} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
      {members.map((member) => (
        <div 
          key={member.id} 
          onClick={() => navigate(`/profile/${member.id}`)}
          className="group relative bg-white rounded-[2rem] overflow-hidden border border-rose-50 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
        >
          {/* SECTION PHOTO */}
          <div className="relative aspect-[3/4] overflow-hidden">
            <img 
              src={member.photo_url || "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400"} 
              alt={member.first_name}
              className={`w-full h-full object-cover transition-all duration-1000 ${
                !forceShowNet ? 'blur-2xl scale-110' : 'blur-0 scale-100 group-hover:scale-105'
              }`} 
            />
            
            {/* Overlay Lock si photos floues */}
            {!forceShowNet && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-[1px]">
                <div className="bg-white/90 p-2.5 rounded-full shadow-lg">
                  <Lock size={18} className="text-primary" />
                </div>
              </div>
            )}

            {/* BOUTON CŒUR / FAVORIS */}
            <button 
              onClick={(e) => toggleFavorite(e, member.id)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all bg-white/80 backdrop-blur-sm shadow-sm hover:scale-110 active:scale-90"
            >
              <Heart 
                size={16} 
                className={`transition-colors ${
                  favorites.includes(member.id) 
                  ? 'fill-rose-500 text-rose-500' 
                  : 'text-slate-300 fill-white'
                }`} 
              />
            </button>
          </div>

          {/* SECTION INFOS */}
          <div className="p-4 bg-white">
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-serif font-bold text-slate-800 truncate">
                  {member.first_name}, {member.age}
                </h3>
                <div className="flex flex-col gap-0.5 mt-1.5 text-[10px] text-slate-400 font-semibold tracking-tight">
                  <span className="flex items-center gap-1 truncate">
                    <MapPin size={10} className="text-primary/60" /> {member.city || "Sénégal"}
                  </span>
                  <span className="flex items-center gap-1 truncate">
                    <Briefcase size={10} className="text-primary/60" /> {member.job || "Membre"}
                  </span>
                </div>
              </div>

              {/* BOUTON DEMANDE */}
              <Button 
                onClick={handleDemande}
                size="sm" 
                className="h-8 px-3 bg-[#EAB308] hover:bg-[#CA8A04] text-white text-[9px] font-black rounded-xl flex items-center gap-1 shadow-sm transition-transform active:scale-95 uppercase tracking-tighter"
              >
                <Send size={10} />
                Demande
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};