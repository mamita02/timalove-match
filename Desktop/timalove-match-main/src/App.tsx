import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import Index from "./pages/Index";
import Legal from './pages/Legal'; // Importez le composant généré
import MemberDetail from "./pages/MemberDetail";
import NotFound from "./pages/NotFound";
import QuiSuisJe from "./pages/QuiSuisJe";
import RegistrationSuccess from "./pages/RegistrationSuccess";
import { UserLogin } from "./pages/UserLogin"; // Vérifie bien le chemin vers ton fichier
import UserProfile from "./pages/UserProfile";

// AJOUTE CES IMPORTS :
import AdminInscriptions from "./pages/AdminInscriptions";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Accueil et Pages Publiques */}
          <Route path="/" element={<Index />} />
          <Route path="/qui-suis-je" element={<QuiSuisJe />} />
          <Route path="/registration-success" element={<RegistrationSuccess />} />
          <Route path="/legal" element={<Legal />} />

          {/* AUTHENTIFICATION CLIENT */}
          <Route path="/login" element={<UserLogin />} />
          
          {/* ESPACE MEMBRES (Protégé par ton code interne) */}
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/profile/:id" element={<MemberDetail />} />

          {/* ADMINISTRATION */}
          {/* J'ai supprimé le doublon /admin ici */}
          <Route path="/admin" element={<AdminPage />} /> 
          <Route path="/admin/inscriptions" element={<AdminInscriptions />} />
          
          {/* 404 - Toujours en dernier */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;