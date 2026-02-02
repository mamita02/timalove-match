import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

export const RegistrationSection = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
    city: "",
    presentation: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Candidature envoyée",
      description: "Notre équipe reviendra vers vous sous 48h.",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    // Hauteur ajustée : de min-h-screen à une hauteur fixe plus raisonnable (ex: 750px)
    <section id="inscription" className="relative w-full min-h-[750px] lg:h-[850px] flex items-center justify-center py-12 overflow-hidden">
      
      {/* ARRIÈRE-PLAN AVEC COUCHE SOMBRE */}
      <div className="absolute inset-0 z-0">
        <img
          src="src/assets/paysagerencontre.png" 
          alt="Fond TimaLove"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          
          {/* TEXTE D'ACCROCHE PLUS COMPACT */}
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl md:text-5xl text-white mb-3 drop-shadow-lg">
              Rejoignez TimaLove
            </h2>
            <p className="text-white/80 text-base md:text-lg font-light max-w-xl mx-auto">
              Votre nouvelle histoire commence ici.
            </p>
          </div>

          {/* FORMULAIRE PLUS DENSE */}
          <div className="w-full max-w-xl bg-white/95 backdrop-blur-xl p-6 md:p-10 rounded-[2rem] shadow-2xl border border-white/20">
            <header className="mb-6 text-center">
              <span className="text-primary font-bold tracking-[0.2em] uppercase text-[9px] mb-1 block">
                Inscription Privée
              </span>
              <h3 className="font-serif text-2xl text-slate-900">Créez votre profil</h3>
            </header>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-[9px] uppercase tracking-widest text-slate-500 ml-1">Prénom / Nom</Label>
                  <div className="flex gap-2">
                    <Input
                      name="firstName"
                      className="h-10 border-slate-200 bg-white/50 focus:border-primary rounded-lg text-sm"
                      placeholder="Prénom"
                      onChange={handleChange}
                      required
                    />
                    <Input
                      name="lastName"
                      className="h-10 border-slate-200 bg-white/50 focus:border-primary rounded-lg text-sm"
                      placeholder="Nom"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1">
                   <Label className="text-[9px] uppercase tracking-widest text-slate-500 ml-1">Téléphone</Label>
                   <Input
                    name="phone"
                    className="h-10 border-slate-200 bg-white/50 focus:border-primary rounded-lg text-sm"
                    placeholder="06 00 00 00 00"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-[9px] uppercase tracking-widest text-slate-500 ml-1">Email professionnel</Label>
                  <Input
                    name="email"
                    type="email"
                    className="h-10 border-slate-200 bg-white/50 focus:border-primary rounded-lg text-sm"
                    placeholder="votre@email.com"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label className="text-[9px] uppercase tracking-widest text-slate-500 ml-1">Âge</Label>
                    <Input
                      name="age"
                      type="number"
                      className="h-10 border-slate-200 bg-white/50 focus:border-primary rounded-lg text-sm"
                      placeholder="28"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label className="text-[9px] uppercase tracking-widest text-slate-500 ml-1">Ville</Label>
                    <Input
                      name="city"
                      className="h-10 border-slate-200 bg-white/50 focus:border-primary rounded-lg text-sm"
                      placeholder="Ex: Paris"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-[9px] uppercase tracking-widest text-slate-500 ml-1">Présentation rapide</Label>
                <Textarea
                  name="presentation"
                  className="min-h-[80px] border-slate-200 bg-white/50 focus:border-primary rounded-xl p-3 text-xs resize-none"
                  placeholder="Décrivez-vous en quelques mots..."
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-full bg-primary hover:bg-primary/90 shadow-lg transition-all text-xs font-bold uppercase tracking-widest"
                >
                  Déposer ma candidature
                </Button>
                <p className="text-[9px] text-slate-400 text-center mt-3">
                   Confidentiel & Sécurisé
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};