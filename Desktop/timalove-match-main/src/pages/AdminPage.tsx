import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Loader2, Lock } from "lucide-react";
import { useEffect, useState } from "react";

// Import de tes composants
import { InscriptionsManager } from "@/components/AdminDashboard";
import { AdminLayout } from "../components/admin/AdminLayout";

const AdminPage = () => {
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // 1. Fonction pour vérifier si l'UID de la session est présent dans la table 'admins'
  const checkIsAdmin = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('id')
        .eq('id', userId)
        .single();

      if (error || !data) {
        console.error("Accès refusé: non présent dans la table admins");
        await supabase.auth.signOut();
        setIsAdmin(false);
        setSession(null);
        return false;
      }
      setIsAdmin(true);
      return true;
    } catch (err) {
      setIsAdmin(false);
      return false;
    }
  };

  // 2. Gestion de la session et de la sécurité au chargement
  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const adminStatus = await checkIsAdmin(session.user.id);
        if (adminStatus) setSession(session);
      }
      setLoading(false);
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      if (currentSession) {
        const adminStatus = await checkIsAdmin(currentSession.user.id);
        if (adminStatus) {
          setSession(currentSession);
        } else {
          setSession(null);
        }
      } else {
        setSession(null);
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 3. Formulaire de connexion
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });

    if (error) {
      toast({ 
        title: "Accès refusé", 
        description: "Identifiants incorrects ou utilisateur inexistant.", 
        variant: "destructive" 
      });
      setAuthLoading(false);
    } else if (data.user) {
      // Une fois logué dans Auth, on vérifie immédiatement s'il est admin
      const adminStatus = await checkIsAdmin(data.user.id);
      if (adminStatus) {
        toast({ title: "Bienvenue Admin", description: "Accès autorisé." });
      } else {
        toast({ 
          title: "Accès non autorisé", 
          description: "Votre compte n'a pas les droits d'administration.", 
          variant: "destructive" 
        });
      }
      setAuthLoading(false);
    }
  };

  // Écran de chargement
  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#F5EEFA]">
      <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  );

  // SI PAS CONNECTÉ OU PAS ADMIN : Affichage du formulaire
  if (!session || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5EEFA] px-4">
        <div className="bg-white p-8 rounded-[40px] shadow-2xl w-full max-w-md border border-white animate-fade-up">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <Lock className="text-primary" size={30} />
            </div>
          </div>
          <h1 className="text-3xl font-serif text-primary text-center mb-8">Espace Privé</h1>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <Input 
              type="email" 
              placeholder="Email Admin" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="rounded-xl h-12"
              required 
            />
            <Input 
              type="password" 
              placeholder="Mot de passe" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="rounded-xl h-12"
              required 
            />
            <Button type="submit" className="w-full h-12 rounded-xl bg-primary text-lg" disabled={authLoading}>
              {authLoading ? <Loader2 className="animate-spin" /> : "Entrer"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // SI CONNECTÉ ET ADMIN : Accès total
  return (
    <AdminLayout>
      <div className="p-6">
        <InscriptionsManager />
      </div>
    </AdminLayout>
  );
};

export default AdminPage;