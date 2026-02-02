import { useState } from "react";
import { Heart, Check, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

const features = [
  "Profil validé manuellement",
  "Accompagnement personnalisé",
  "Mise en relation sur mesure",
  "Confidentialité garantie",
];

// Schéma de validation Zod
const registrationSchema = z.object({
  firstName: z.string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères"),
  lastName: z.string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
  email: z.string()
    .email("Adresse email invalide")
    .toLowerCase(),
  phone: z.string()
    .regex(
      /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
      "Numéro de téléphone français invalide"
    ),
  age: z.coerce.number()
    .int("L'âge doit être un nombre entier")
    .min(18, "Vous devez avoir au moins 18 ans")
    .max(99, "L'âge ne peut pas dépasser 99 ans"),
  city: z.string()
    .min(2, "La ville doit contenir au moins 2 caractères")
    .max(100, "La ville ne peut pas dépasser 100 caractères"),
  profession: z.string()
    .max(100, "La profession ne peut pas dépasser 100 caractères")
    .optional(),
  presentation: z.string()
    .min(50, "Votre présentation doit contenir au moins 50 caractères")
    .max(1000, "Votre présentation ne peut pas dépasser 1000 caractères"),
  lookingFor: z.string()
    .min(30, "Décrivez ce que vous recherchez en au moins 30 caractères")
    .max(500, "Cette description ne peut pas dépasser 500 caractères"),
  acceptTerms: z.boolean()
    .refine((val) => val === true, {
      message: "Vous devez accepter les conditions d'utilisation",
    }),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export const RegistrationSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      age: undefined,
      city: "",
      profession: "",
      presentation: "",
      lookingFor: "",
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);
    
    try {
      // Importer dynamiquement le service Supabase
      const { createRegistration } = await import('@/lib/supabase');
      
      // Préparer les données (retirer acceptTerms car non stocké en DB)
      const { acceptTerms, ...registrationData } = data;
      
      // Envoyer à Supabase
      const response = await createRegistration(registrationData);
      
      if (!response.success) {
        throw new Error(response.error || "Erreur lors de l'inscription");
      }
      
      console.log("✅ Inscription créée dans Supabase:", response.data?.id);
      
      toast({
        title: "✓ Inscription reçue avec succès !",
        description: "Nous examinerons votre profil et vous contacterons très prochainement.",
      });
      
      // Réinitialiser le formulaire après succès
      form.reset();
    } catch (error) {
      console.error("❌ Erreur lors de l'inscription:", error);
      
      // Fallback : sauvegarder localement si Supabase échoue
      try {
        const { saveRegistrationLocally } = await import('@/lib/api');
        const { acceptTerms, ...registrationData } = data;
        saveRegistrationLocally(registrationData);
        
        toast({
          title: "⚠️ Inscription sauvegardée localement",
          description: "Nous avons sauvegardé votre inscription. Nous vous contacterons dès que possible.",
        });
      } catch (fallbackError) {
        toast({
          title: "Erreur lors de l'inscription",
          description: error instanceof Error ? error.message : "Une erreur s'est produite. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
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
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prénom *</FormLabel>
                          <FormControl>
                            <Input placeholder="Votre prénom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom *</FormLabel>
                          <FormControl>
                            <Input placeholder="Votre nom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="votre@email.com" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone *</FormLabel>
                          <FormControl>
                            <Input 
                              type="tel" 
                              placeholder="+33 6 00 00 00 00" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Âge *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="18" 
                              max="99" 
                              placeholder="Votre âge" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ville *</FormLabel>
                          <FormControl>
                            <Input placeholder="Votre ville" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="profession"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profession</FormLabel>
                        <FormControl>
                          <Input placeholder="Votre métier" {...field} />
                        </FormControl>
                        <FormDescription>
                          Optionnel
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="presentation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Présentez-vous *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Parlez-nous de vous, de vos passions, de ce qui vous rend unique..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Minimum 50 caractères - {field.value?.length || 0}/1000
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lookingFor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Que recherchez-vous ? *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Décrivez le partenaire idéal et le type de relation que vous recherchez..."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Minimum 30 caractères - {field.value?.length || 0}/500
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="acceptTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal">
                            J'accepte les{" "}
                            <a href="#" className="text-primary hover:underline">
                              conditions d'utilisation
                            </a>{" "}
                            et la{" "}
                            <a href="#" className="text-primary hover:underline">
                              politique de confidentialité
                            </a>
                            . *
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    variant="romantic" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      "Envoyer mon inscription"
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Vos données sont traitées avec la plus grande confidentialité.
                  </p>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
