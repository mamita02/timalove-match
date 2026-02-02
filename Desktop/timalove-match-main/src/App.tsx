import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import MemberDetail from "./pages/MemberDetail";
import NotFound from "./pages/NotFound";
import QuiSuisJe from "./pages/QuiSuisJe"; // On importe la PAGE entière ici
import UserProfile from "./pages/UserProfile"; // Ajoute cet import

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* L'accueil contient déjà l'AboutSection à l'intérieur */}
          <Route path="/" element={<Index />} />
          
          {/* Cette route affiche la page de lecture complète */}
          <Route path="/qui-suis-je" element={<QuiSuisJe />} />
          <Route path="/profile" element={<UserProfile />} /> {/* Route de test */}
          <Route path="/profile/:id" element={<MemberDetail />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;