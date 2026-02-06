import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast"; // Assure-toi d'avoir ce hook ou utilise alert()
import { supabase } from "@/lib/supabase";
import { Briefcase, Check, Heart, Loader2, Lock, MapPin, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface MemberGalleryProps {
  forceShowNet: boolean;
  limit: number;
  targetSexe: 'homme' | 'femme';
}

export const MemberGallery = ({ forceShowNet, limit, targetSexe }: MemberGalleryProps) => {
  const navigate = useNavigate();
  
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sentRequests, setSentRequests] = useState<string[]>([]); // <-- NOUVEAU : Liste des demandes envoyées
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // 1. On récupère l'utilisateur connecté
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setCurrentUserId(data.user.id);
        fetchMyInteractions(data.user.id);
      }
    });
  }, []);

  // 2. On charge mes likes ET mes demandes déjà envoyées
  const fetchMyInteractions = async (userId: string) => {
    // Récupérer les likes (Favoris)
    // (Note: Idéalement on ferait un appel à une table 'likes', ici on gère en local temporaire ou via une autre logique, 
    // mais pour les DEMANDES, on va lire la vraie table)
    
    // Récupérer les demandes (Requests) pour savoir qui j'ai déjà contacté
    const { data: requests } = await supabase
      .from('requests')
      .select('receiver_id')
      .eq('sender_id', userId);

    if (requests) {
      setSentRequests(requests.map(r => r.receiver_id));
    }
  };

  // 3. Charger les profils
  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      const dbGender = targetSexe === 'femme' ? 'female' : 'male';

      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .eq('gender', dbGender)
        .eq('status', 'approved') 
        .neq('role', 'admin') 
        .limit(limit);

      if (!error && data) {
        setMembers(data);
      }
      setLoading(false);
    };

    fetchProfiles();
  }, [targetSexe, limit]);

  // --- LOGIQUE CŒUR (Like) ---
  const toggleFavorite = async (e: React.MouseEvent, targetId: string) => {
    e.stopPropagation();
    if (!currentUserId) return toast({ title: "Oups", description: "Connectez-vous pour aimer un profil." });

    const isAlreadyLiked = favorites.includes(targetId);
    setFavorites(prev => isAlreadyLiked ? prev.filter(id => id !== targetId) : [...prev, targetId]);

    if (!isAlreadyLiked) {
        // Envoi notif like
        await supabase.from('notifications').insert({
            from_user_id: currentUserId,
            to_user_id: targetId,
            message: "vous a envoyé un coup de cœur !",
            type: 'like'
        });
    }
  };

  // --- LOGIQUE DEMANDE (Nouveau) ---
  const handleDemande = async (e: React.MouseEvent, targetId: string, targetName: string) => {
    e.stopPropagation();
    
    if (!currentUserId) {
      return toast({ title: "Connexion requise", description: "Veuillez vous connecter pour envoyer une demande." });
    }

    // 1. Vérifier si déjà envoyé (Protection double-clic)
    if (sentRequests.includes(targetId)) return;

    // 2. Insérer dans la table REQUESTS
    const { error } = await supabase.from('requests').insert({
      sender_id: currentUserId,
      receiver_id: targetId,
      status: 'pending'
    });

    if (error) {
      // Si erreur (ex: déjà existant en base), on arrête
      console.error(error);
      toast({ title: "Erreur", description: "Impossible d'envoyer la demande.", variant: "destructive" });
      return;
    }

    // 3. Envoyer la NOTIFICATION à la personne
    await supabase.from('notifications').insert({
      from_user_id: currentUserId,
      to_user_id: targetId,
      message: "souhaite entrer en contact avec vous !",
      type: 'request_received'
    });

    // 4. Mettre à jour l'état local (Bouton change immédiatement)
    setSentRequests(prev => [...prev, targetId]);
    
    toast({ 
      title: "Demande envoyée ! 🚀", 
      description: `Une notification a été envoyée à ${targetName}.` 
    });
  };

  if (loading && members.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-primary/50" size={32} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
      {members.map((member) => {
        const isRequested = sentRequests.includes(member.id); // Est-ce que j'ai déjà demandé ?

        return (
          <div 
            key={member.id} 
            onClick={() => navigate(`/profile/${member.id}`)}
            className="group relative bg-white rounded-[2rem] overflow-hidden border border-rose-50 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            {/* PHOTO */}
            <div className="relative aspect-[3/4] overflow-hidden">
              <img 
                src={member.photo_url || "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400"} 
                alt={member.first_name}
                className={`w-full h-full object-cover transition-all duration-1000 ${
                  !forceShowNet ? 'blur-2xl scale-110' : 'blur-0 scale-100 group-hover:scale-105'
                }`} 
              />
              
              {!forceShowNet && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-[1px]">
                  <div className="bg-white/90 p-2.5 rounded-full shadow-lg">
                    <Lock size={18} className="text-primary" />
                  </div>
                </div>
              )}

              <button 
                onClick={(e) => toggleFavorite(e, member.id)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all bg-white/80 backdrop-blur-sm shadow-sm hover:scale-110 active:scale-90"
              >
                <Heart 
                  size={16} 
                  className={`transition-colors ${
                    favorites.includes(member.id) ? 'fill-rose-500 text-rose-500' : 'text-slate-300 fill-white'
                  }`} 
                />
              </button>
            </div>

            {/* INFOS */}
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

                {/* BOUTON DEMANDE DYNAMIQUE */}
                <Button 
                  onClick={(e) => handleDemande(e, member.id, member.first_name)}
                  size="sm" 
                  disabled={isRequested} // On désactive si déjà demandé
                  className={`h-8 px-3 text-[9px] font-black rounded-xl flex items-center gap-1 shadow-sm transition-all uppercase tracking-tighter ${
                    isRequested 
                      ? "bg-slate-100 text-slate-400 hover:bg-slate-100 cursor-default" // Style "Intéressé"
                      : "bg-[#EAB308] hover:bg-[#CA8A04] text-white hover:scale-105 active:scale-95" // Style "Demande"
                  }`}
                >
                  {isRequested ? (
                    <>
                      <Check size={10} />
                      Intéressé
                    </>
                  ) : (
                    <>
                      <Send size={10} />
                      Demande
                    </>
                  )}
                </Button>

              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};