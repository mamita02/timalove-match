import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Briefcase, ChevronLeft, Heart, MapPin, Send, ShieldCheck } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const MemberDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Plus tard, vous ferez un fetch Supabase ici avec l'ID
  const member = {
    name: "Thomas",
    age: 32,
    city: "Paris",
    job: "Médecin",
    description: "Je recherche une relation sérieuse basée sur la confiance et le respect mutuel. Passionné par mon métier, j'aime aussi voyager et découvrir de nouvelles cultures.",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800"
  };

  return (
    <div className="min-h-screen bg-[#FDFBFB]">
      <Navbar />
      <main className="pt-28 pb-12 container mx-auto px-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-primary mb-6 transition-colors">
          <ChevronLeft size={20} /> Retour aux profils
        </button>

        <div className="bg-white rounded-[2.5rem] border border-rose-50 shadow-sm overflow-hidden flex flex-col md:flex-row">
          {/* Photo */}
          <div className="md:w-1/2 aspect-[4/5] md:aspect-auto">
            <img src={member.img} className="w-full h-full object-cover" alt={member.name} />
          </div>

          {/* Détails */}
          <div className="md:w-1/2 p-8 md:p-12 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-serif text-slate-900">{member.name}, {member.age}</h1>
                <div className="flex gap-4 mt-3 text-slate-500">
                  <span className="flex items-center gap-1"><MapPin size={18} className="text-primary"/> {member.city}</span>
                  <span className="flex items-center gap-1"><Briefcase size={18} className="text-primary"/> {member.job}</span>
                </div>
              </div>
              <div className="bg-green-50 p-2 rounded-xl border border-green-100">
                <ShieldCheck className="text-green-600" size={24} />
              </div>
            </div>

            <div className="py-6 border-y border-slate-100">
              <h2 className="font-serif text-xl mb-3 text-slate-800">À propos</h2>
              <p className="text-slate-600 leading-relaxed italic">"{member.description}"</p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button className="flex-1 h-14 bg-primary rounded-2xl font-bold text-lg gap-2">
                <Heart size={20} /> Envoyer un coup de cœur
              </Button>
              <Button className="h-14 px-8 bg-[#EAB308] hover:bg-[#CA8A04] text-white rounded-2xl font-bold gap-2">
                <Send size={20} /> Demande
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MemberDetail;