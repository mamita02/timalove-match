import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

// UI Components
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

// 1. Schéma de validation
const registrationSchema = z.object({
  firstName: z.string().min(2, "Le prénom est requis"),
  lastName: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide").toLowerCase(),
  gender: z.enum(["male", "female"], { 
    required_error: "Veuillez sélectionner votre sexe" 
  }),
  country: z.enum(["Sénégal", "France"], { 
    required_error: "Veuillez sélectionner un pays" 
  }),
  phone: z.string().min(9, "Numéro trop court"),
  age: z.coerce.number().min(18, "18 ans minimum").max(99),
  city: z.string().min(2, "La ville est requise"),
  presentation: z.string().min(50, "50 caractères minimum"),
  lookingFor: z.string().min(30, "30 caractères minimum"),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export const RegistrationSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      age: undefined,
      city: "",
      presentation: "",
      lookingFor: "",
      country: "Sénégal",
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);
    try {
      const { supabase } = await import('@/lib/supabase');
      let photoUrl = "";

      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `public/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('registration-photos')
          .upload(filePath, photoFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('registration-photos')
          .getPublicUrl(filePath);
        
        photoUrl = urlData.publicUrl;
      }

      const { error } = await supabase
        .from('registrations')
        .insert([
          {
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            phone: data.phone,
            age: data.age,
            city: data.city,
            gender: data.gender,
            country: data.country,
            photo_url: photoUrl,
            presentation: data.presentation,
            looking_for: data.lookingFor,
            status: 'pending'
          }
        ]);

      if (error) throw error;

      toast({ title: "Candidature envoyée !" });
      navigate("/registration-success");

    } catch (error: any) {
      console.error(error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="inscription" className="relative w-full min-h-[1000px] flex items-center justify-center py-12 overflow-hidden">
      
      {/* ARRIÈRE-PLAN AVEC IMAGE */}
      <div className="absolute inset-0 z-0">
        <img
          src="src/assets/paysagerencontre.png" 
          alt="Fond TimaLove"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl md:text-5xl text-white mb-3 drop-shadow-lg">
              Rejoignez TimaLove
            </h2>
            <p className="text-white/80 text-base md:text-lg font-light max-w-xl mx-auto">
              Votre nouvelle histoire commence ici.
            </p>
          </div>

          <div className="w-full max-w-xl bg-white/95 backdrop-blur-xl p-6 md:p-8 rounded-[2.5rem] shadow-2xl border border-white/20">
            <header className="mb-6 text-center">
              <span className="text-primary font-bold tracking-[0.2em] uppercase text-[9px] mb-1 block">
                Inscription Privée
              </span>
              <h3 className="font-serif text-2xl text-slate-900">Créez votre profil</h3>
            </header>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                
                {/* UPLOAD PHOTO */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative group">
                    <Label htmlFor="photo-upload" className="cursor-pointer">
                      <div className="w-24 h-24 rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center overflow-hidden bg-white hover:bg-slate-50 transition-all">
                        {previewUrl ? (
                          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <Camera className="w-7 h-7 text-slate-400 group-hover:text-primary transition-colors" />
                        )}
                      </div>
                    </Label>
                    <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                    {previewUrl && (
                      <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1 shadow-lg">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] mt-2 uppercase font-bold text-slate-400 tracking-tighter">Photo de profil</span>
                </div>

                {/* GENRE ET PAYS */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <Label className="text-[9px] uppercase tracking-widest text-slate-500 ml-1">Sexe</Label>
                        <select {...field} className="w-full h-10 rounded-xl border-slate-200 bg-white text-sm px-3 outline-none focus:ring-1 focus:ring-primary">
                          <option value="">Choisir...</option>
                          <option value="male">Homme</option>
                          <option value="female">Femme</option>
                        </select>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <Label className="text-[9px] uppercase tracking-widest text-slate-500 ml-1">Pays</Label>
                        <select {...field} className="w-full h-10 rounded-xl border-slate-200 bg-white text-sm px-3 outline-none focus:ring-1 focus:ring-primary">
                          <option value="Sénégal">Sénégal</option>
                          <option value="France">France</option>
                        </select>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* NOM & PRÉNOM */}
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="firstName" render={({ field }) => (
                    <FormItem className="space-y-1">
                      <Label className="text-[9px] uppercase tracking-widest text-slate-500 ml-1">Prénom</Label>
                      <FormControl><Input placeholder="Prénom" className="h-10 border-slate-200 bg-white text-sm rounded-xl" {...field} /></FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="lastName" render={({ field }) => (
                    <FormItem className="space-y-1">
                      <Label className="text-[9px] uppercase tracking-widest text-slate-500 ml-1">Nom</Label>
                      <FormControl><Input placeholder="Nom" className="h-10 border-slate-200 bg-white text-sm rounded-xl" {...field} /></FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )} />
                </div>

                {/* EMAIL & TÉLÉPHONE */}
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem className="space-y-1">
                      <Label className="text-[9px] uppercase tracking-widest text-slate-500 ml-1">Email</Label>
                      <FormControl><Input type="email" placeholder="votre@email.com" className="h-10 border-slate-200 bg-white text-sm rounded-xl" {...field} /></FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem className="space-y-1">
                      <Label className="text-[9px] uppercase tracking-widest text-slate-500 ml-1">Téléphone ({form.watch("country") === "Sénégal" ? "+221" : "FR"})</Label>
                      <FormControl><Input placeholder="Numéro" className="h-10 border-slate-200 bg-white text-sm rounded-xl" {...field} /></FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )} />
                </div>

                {/* AGE & VILLE */}
                <div className="grid grid-cols-3 gap-4">
                  <FormField control={form.control} name="age" render={({ field }) => (
                    <FormItem className="space-y-1">
                      <Label className="text-[9px] uppercase tracking-widest text-slate-500 ml-1">Âge</Label>
                      <FormControl><Input type="number" placeholder="28" className="h-10 border-slate-200 bg-white text-sm rounded-xl" {...field} /></FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem className="col-span-2 space-y-1">
                      <Label className="text-[9px] uppercase tracking-widest text-slate-500 ml-1">Ville</Label>
                      <FormControl><Input placeholder="Ex: Dakar ou Paris" className="h-10 border-slate-200 bg-white text-sm rounded-xl" {...field} /></FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )} />
                </div>

                {/* TEXTAREAS */}
                <FormField control={form.control} name="presentation" render={({ field }) => (
                  <FormItem className="space-y-1">
                    <Label className="text-[9px] uppercase tracking-widest text-slate-500 ml-1">Présentation (50 car. min)</Label>
                    <FormControl><Textarea placeholder="Parlez-nous de vous..." className="min-h-[80px] border-slate-200 bg-white rounded-xl p-3 text-xs resize-none" {...field} /></FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )} />

                <FormField control={form.control} name="lookingFor" render={({ field }) => (
                  <FormItem className="space-y-1">
                    <Label className="text-[9px] uppercase tracking-widest text-slate-500 ml-1">Partenaire idéal (30 car. min)</Label>
                    <FormControl><Textarea placeholder="Ce que vous recherchez..." className="min-h-[60px] border-slate-200 bg-white rounded-xl p-3 text-xs resize-none" {...field} /></FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )} />

                <div className="pt-2">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-full bg-primary hover:bg-primary/90 shadow-lg transition-all text-xs font-bold uppercase tracking-widest"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Envoi...</>
                    ) : (
                      "Déposer ma candidature"
                    )}
                  </Button>
                  <p className="text-[9px] text-slate-400 text-center mt-3">
                     Confidentiel & Sécurisé • TimaLove Agency
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};