import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import MemberDetail from "./pages/MemberDetail";
import NotFound from "./pages/NotFound";
import QuiSuisJe from "./pages/QuiSuisJe";
import RegistrationSuccess from "./pages/RegistrationSuccess";
import UserProfile from "./pages/UserProfile";

// AJOUTE CES IMPORTS :
import Admin from "./pages/Admin";
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
          
          {/* Espace Membres */}
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/profile/:id" element={<MemberDetail />} />

          {/* AJOUTE LES ROUTES ADMIN ICI : */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/inscriptions" element={<AdminInscriptions />} />
          
          {/* 404 - Toujours en dernier */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;