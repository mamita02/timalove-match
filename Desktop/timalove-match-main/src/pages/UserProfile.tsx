import { Footer } from "@/components/Footer";
import { MemberGallery } from "@/components/MemberGallery";
import { Navbar } from "@/components/Navbar";
import { NotificationList } from "@/components/NotificationList"; // L'importation qui manquait
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Bell, Filter, Loader2, Search, User } from "lucide-react";
import { useEffect, useState } from "react";

const UserProfile = () => {
  const [userSexe, setUserSexe] = useState<'homme' | 'femme' | null>(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifs, setShowNotifs] = useState(false); // État pour ouvrir/fermer la liste

  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);

  useEffect(() => {
    const initializeProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;

        if (user) {
          const { data: profile } = await supabase
            .from('registrations')
            .select('gender')
            .eq('id', user.id)
            .single();

          if (profile) {
            const isFemale = profile.gender.toLowerCase().startsWith('f');
            setUserSexe(isFemale ? 'femme' : 'homme');
            setHasPaid(isFemale); 
          }

          fetchNotifications(user.id);

          const channel = supabase
            .channel('realtime_notifications')
            .on('postgres_changes', 
              { event: 'INSERT', schema: 'public', table: 'notifications', filter: `to_user_id=eq.${user.id}` }, 
              () => fetchNotifications(user.id)
            )
            .subscribe();

          return () => { supabase.removeChannel(channel); };
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    initializeProfile();
  }, []);

  const fetchNotifications = async (userId: string) => {
    const { count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('to_user_id', userId)
      .eq('is_read', false);
    
    if (count !== null) setUnreadCount(count);
  };

  if (loading || userSexe === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBFB]">
        <Loader2 className="animate-spin text-rose-400" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBFB]">
      <Navbar />
      
      <div className="pt-20 pb-4 bg-white/95 backdrop-blur-md border-b border-rose-100 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 flex-1 max-w-lg">
              <Search size={18} className="text-slate-400" />
              <input type="text" placeholder="Rechercher un profil..." className="bg-transparent border-none outline-none text-sm w-full" />
            </div>

            <div className="hidden md:flex items-center gap-4 ml-auto">
               <div className="relative">
                  <button 
                    onClick={() => {
                      setShowNotifs(!showNotifs);
                      if (!showNotifs) setUnreadCount(0);
                    }}
                    className={`relative p-2 transition-colors ${showNotifs ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'}`}
                  >
                    <Bell size={24} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Affichage de la liste */}
                  {showNotifs && (
                    <div className="absolute top-full right-0 mt-2 z-50 animate-in fade-in zoom-in duration-200">
                      <NotificationList />
                    </div>
                  )}
               </div>
               <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-400 border border-rose-100">
                  <User size={20} />
               </div>
            </div>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
            <Button variant="outline" className="rounded-xl border-slate-200 gap-2 h-9 text-xs font-bold text-slate-600">
              <Filter size={14} /> Filtres
            </Button>
            {["Pays", "Célibataire", "18-25", "26-35", "36+"].map((f) => (
              <button key={f} className="px-4 py-2 bg-white border border-slate-100 rounded-full text-[11px] font-bold text-slate-500 hover:border-rose-300 shadow-sm whitespace-nowrap">
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="py-8 container mx-auto px-4">
        {userSexe === 'homme' && !hasPaid && (
          <div className="mb-10 bg-slate-900 rounded-[2.5rem] p-8 text-white flex items-center justify-between shadow-xl">
            <div>
              <h2 className="text-2xl font-serif mb-2 text-rose-200">Accès Premium</h2>
              <p className="text-slate-400 text-sm">Débloquez les photos pour 50 €.</p>
            </div>
            <Button onClick={() => setHasPaid(true)} className="bg-rose-500 hover:bg-rose-600 text-white px-10 rounded-2xl font-bold">
              Débloquer
            </Button>
          </div>
        )}

        <h1 className="text-2xl font-serif text-slate-900 mb-8">
          Profils {userSexe === 'femme' ? 'masculins' : 'féminins'}
        </h1>

        <MemberGallery 
          forceShowNet={hasPaid} 
          limit={visibleCount} 
          targetSexe={userSexe === 'femme' ? 'homme' : 'femme'} 
        />

        <div className="mt-16 text-center">
          <Button 
            onClick={() => {
              setFetchingMore(true);
              setTimeout(() => { setVisibleCount(v => v + 5); setFetchingMore(false); }, 800);
            }} 
            variant="outline" 
            className="rounded-full px-16 h-14 border-rose-200 text-rose-500 font-bold"
            disabled={fetchingMore}
          >
            {fetchingMore ? <Loader2 className="animate-spin mr-2" size={20} /> : "Afficher plus"}
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;