import { Briefcase, Heart, Lock, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

interface MemberGalleryProps {
  forceShowNet: boolean; // Géré par le statut payant/sexe dans UserProfile
  limit: number;         // Pour le système "Voir plus"
  targetSexe: 'homme' | 'femme';
}

export const MemberGallery = ({ forceShowNet, limit, targetSexe }: MemberGalleryProps) => {
  const navigate = useNavigate();
  
  // État local pour les favoris (Sera lié à Supabase plus tard)
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Empêche d'ouvrir le profil quand on clique sur le cœur
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  const handleDemande = (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêche d'ouvrir le profil quand on clique sur le bouton demande
    // Logique pour contacter l'admin ici
    console.log("Demande envoyée à l'administratrice");
  };

  // Simulation des données (À remplacer par l'appel Supabase)
  const members = [
    { id: 1, name: "Sophie", age: 28, city: "Dakar", job: "Architecte", sexe: "femme", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400" },
    { id: 2, name: "Thomas", age: 32, city: "Paris", job: "Médecin", sexe: "homme", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400" },
    { id: 3, name: "Amina", age: 26, city: "Saint-Louis", job: "Enseignante", sexe: "femme", img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400" },
    { id: 4, name: "Marc", age: 35, city: "Lyon", job: "Entrepreneur", sexe: "homme", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400" },
    { id: 5, name: "Fatou", age: 29, city: "Thies", job: "Pharmacienne", sexe: "femme", img: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400" },
    { id: 6, name: "Alassane", age: 31, city: "Dakar", job: "Ingénieur", sexe: "homme", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400" },
  ];

  // Filtrage par sexe et limite d'affichage
  const displayList = members
    .filter(m => m.sexe === targetSexe)
    .slice(0, limit);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
      {displayList.map((member) => (
        <div 
          key={member.id} 
          onClick={() => navigate(`/profile/${member.id}`)}
          className="group relative bg-white rounded-[2rem] overflow-hidden border border-rose-50 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
        >
          {/* SECTION PHOTO */}
          <div className="relative aspect-[3/4] overflow-hidden">
            <img 
              src={member.img} 
              alt={member.name}
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
                  {member.name}, {member.age}
                </h3>
                <div className="flex flex-col gap-0.5 mt-1.5 text-[10px] text-slate-400 font-semibold tracking-tight">
                  <span className="flex items-center gap-1 truncate">
                    <MapPin size={10} className="text-primary/60" /> {member.city}
                  </span>
                  <span className="flex items-center gap-1 truncate">
                    <Briefcase size={10} className="text-primary/60" /> {member.job}
                  </span>
                </div>
              </div>

              {/* BOUTON DEMANDE (À CÔTÉ DU TEXTE) */}
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