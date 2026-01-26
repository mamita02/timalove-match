import { useState } from "react";
import { Heart, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { toast } from "@/hooks/use-toast";

const features = [
  "Profil validé manuellement",
  "Accompagnement personnalisé",
  "Mise en relation sur mesure",
  "Confidentialité garantie",
];

export const RegistrationSection = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
    city: "",
    profession: "",
    presentation: "",
    lookingFor: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Inscription reçue !",
      description: "Nous vous contacterons très prochainement.",
    });
    console.log("Form submitted:", formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="inscription" className="py-20 md:py-32 bg-gradient-soft">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Column - Info */}
            <div>
              <span className="inline-block text-primary font-medium text-sm tracking-wider uppercase mb-4">
                Rejoignez-nous
              </span>
              <h2 className="font-serif text-3xl md:text-5xl font-medium mb-6">
                Commencez votre histoire d'amour
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Remplissez ce formulaire pour nous permettre de mieux vous connaître. 
                Notre équipe examinera votre profil avec attention.
              </p>

              {/* Features */}
              <div className="space-y-4 mb-10">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check size={14} className="text-primary" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Decorative Card */}
              <div className="bg-card p-6 rounded-2xl shadow-card">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-romantic flex items-center justify-center">
                    <Heart size={24} className="text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-serif text-lg font-medium">
                      Accompagnement humain
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Chaque profil est traité avec soin
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground italic">
                  "Nous croyons que les plus belles histoires d'amour méritent 
                  un accompagnement personnalisé, pas un algorithme."
                </p>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="bg-card p-8 md:p-10 rounded-2xl shadow-elevated">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Votre prénom"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+33 6 00 00 00 00"
                      required
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Âge *</Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      min="18"
                      max="99"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="Votre âge"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Votre ville"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profession">Profession</Label>
                  <Input
                    id="profession"
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    placeholder="Votre métier"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="presentation">Présentez-vous *</Label>
                  <Textarea
                    id="presentation"
                    name="presentation"
                    value={formData.presentation}
                    onChange={handleChange}
                    placeholder="Parlez-nous de vous, de vos passions, de ce qui vous rend unique..."
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lookingFor">Que recherchez-vous ? *</Label>
                  <Textarea
                    id="lookingFor"
                    name="lookingFor"
                    value={formData.lookingFor}
                    onChange={handleChange}
                    placeholder="Décrivez le partenaire idéal et le type de relation que vous recherchez..."
                    rows={3}
                    required
                  />
                </div>

                <Button type="submit" variant="romantic" size="lg" className="w-full">
                  Envoyer mon inscription
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  En soumettant ce formulaire, vous acceptez nos{" "}
                  <a href="#" className="text-primary hover:underline">
                    conditions d'utilisation
                  </a>{" "}
                  et notre{" "}
                  <a href="#" className="text-primary hover:underline">
                    politique de confidentialité
                  </a>
                  .
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
