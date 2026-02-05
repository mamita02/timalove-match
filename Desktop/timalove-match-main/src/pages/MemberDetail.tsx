import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Briefcase, ChevronLeft, Globe, Heart, Loader2, MapPin, Moon, Send, ShieldCheck, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const MemberDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasPaid, setHasPaid] = useState(false); 

  useEffect(() => {
    const fetchMember = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('registrations').select('*').eq('id', id).single();
      if (!error) setMember(data);
      setLoading(false);
    };
    if (id) fetchMember();
  }, [id]);

  // LA FONCTION DOIT ÊTRE DÉCLARÉE COMME CECI
  const handleLike = async () => {
    try {
      // 1. On récupère l'utilisateur connecté
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Vous devez être connecté pour envoyer un coup de cœur");
        return;
      }

      // 2. On insère la notification
      const { error } = await supabase
        .from('notifications')
        .insert([
          { 
            from_user_id: user.id, // ID de l'homme (expéditeur)
            to_user_id: member.id,   // ID de la femme (destinataire)
            type: 'like',
            message: `Un membre a flashé sur votre profil !`,
            is_read: false
          }
        ]);

      if (error) throw error;

      toast.success("Coup de cœur envoyé !");
      
    } catch (error: any) {
      console.error("Erreur notification:", error);
      toast.error("Une erreur est survenue lors de l'envoi");
    }
  };

  if (loading || !member) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-[#FDFBFB]">
      <Navbar />
      <main className="pt-28 pb-12 container mx-auto px-4 max-w-6xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-primary mb-8 transition-colors text-sm font-medium">
          <ChevronLeft size={18} /> Retour aux profils
        </button>

        <div className="bg-white rounded-[3rem] border border-rose-50 shadow-sm overflow-hidden flex flex-col md:flex-row p-4 md:p-12 gap-8 md:gap-16 items-start">
          
          <div className="w-full md:w-[380px] aspect-[3/4] relative rounded-[2.5rem] overflow-hidden bg-slate-100 flex-shrink-0">
            <img 
              src={member.photo_url || "/placeholder.jpg"} 
              className={`w-full h-full object-cover transition-all duration-1000 ${!hasPaid ? 'blur-[30px] scale-110' : ''}`} 
              alt={member.first_name} 
            />
            {!hasPaid && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 bg-black/5">
                <h2 className="text-2xl font-serif font-bold drop-shadow-md">
                  {member.first_name} , {member.age}
                </h2>
                <p className="text-xs font-medium opacity-70 mt-1 tracking-wide uppercase">Galerie privée</p>
              </div>
            )}
          </div>

          <div className="flex-1 w-full space-y-8 py-2">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h1 className="text-4xl font-serif text-slate-900">{member.first_name} , {member.age}</h1>
                <div className="flex items-center gap-3 text-slate-400 font-medium text-sm">
                   <span className="flex items-center gap-1.5"><MapPin size={16} className="text-rose-300"/> {member.city}</span>
                   <span className="text-slate-200">|</span>
                   <span className="flex items-center gap-1.5"><Briefcase size={16} className="text-rose-300"/> Membre</span>
                </div>
              </div>
              <div className="p-2 bg-green-50 rounded-xl border border-green-100">
                <ShieldCheck className="text-green-500" size={24} />
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoCard label="Âge" value={`${member.age} ans`} icon={<User size={14}/>} />
              <div className="bg-white border border-rose-50/50 p-4 rounded-[1.5rem] shadow-sm hover:shadow-md transition-shadow">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <MapPin size={14}/> Ville
                </p>
                <p className="text-sm font-bold text-slate-700">{member.city}</p>
              </div>
              <InfoCard label="Origine" value={member.country} icon={<Globe size={14}/>} />
              <InfoCard label="Résidence" value={member.residence_country || member.country} icon={<MapPin size={14}/>} />
              <InfoCard label="Religion" value={member.religion || "Musulmane"} icon={<Moon size={14}/>} />
            </div>

            <div className="space-y-4 pt-4">
              <h2 className="text-[10px] font-black uppercase text-slate-300 tracking-[0.2em]">Présentation du profil</h2>
              <p className="text-slate-500 italic font-serif text-lg leading-relaxed px-2">
                "{member.presentation || "Pas de description disponible."}"
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <h2 className="text-[10px] font-black uppercase text-slate-300 tracking-[0.2em]">Ce qu'il/elle recherche</h2>
              <p className="text-slate-600 font-medium leading-relaxed px-2">
                {member.looking_for || "Recherche une relation sérieuse."}
              </p>
            </div>

            <div className="flex items-center gap-4 pt-6">
              <Button 
                onClick={handleLike} 
                className="flex-1 h-16 bg-rose-400 hover:bg-rose-500 text-white rounded-[1.25rem] font-bold text-lg shadow-lg shadow-rose-100 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <Heart size={22} className="fill-current" /> Envoyer un coup de cœur
              </Button>
              
              <Button 
                onClick={() => toast.info("Demande envoyée à l'administration")}
                className="w-16 h-16 bg-amber-400 hover:bg-amber-500 text-white rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-amber-100 transition-all active:scale-95"
              >
                <Send size={24} />
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const InfoCard = ({ label, value, icon }: { label: string, value: string, icon: any }) => (
  <div className="bg-white border border-rose-50/50 p-4 rounded-[1.5rem] shadow-sm hover:shadow-md transition-shadow">
    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
      {icon} {label}
    </p>
    <p className="text-sm font-bold text-slate-700">{value}</p>
  </div>
);

export default MemberDetail;