import { Mail, Phone, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { toast } from "@/hooks/use-toast";

export const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message envoyé !",
      description: "Nous vous répondrons dans les plus brefs délais.",
    });
    setFormData({ name: "", email: "", message: "" });
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
    <section id="contact" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block text-primary font-medium text-sm tracking-wider uppercase mb-4">
              Contact
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-medium mb-6">
              Une question ? Parlons-en
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Notre équipe est à votre écoute pour répondre à toutes vos questions 
              et vous accompagner dans votre démarche.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-10">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card p-6 rounded-2xl shadow-card hover-lift">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-medium mb-1">Email</h3>
                    <p className="text-muted-foreground text-sm mb-2">
                      Réponse sous 24h
                    </p>
                    <a
                      href="mailto:contact@timalove.com"
                      className="text-primary hover:underline"
                    >
                      contact@timalove.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-2xl shadow-card hover-lift">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-medium mb-1">Téléphone</h3>
                    <p className="text-muted-foreground text-sm mb-2">
                      Lun - Ven, 9h - 18h
                    </p>
                    <a
                      href="tel:+33600000000"
                      className="text-primary hover:underline"
                    >
                      +33 6 00 00 00 00
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-romantic p-6 rounded-2xl shadow-card hover-lift text-primary-foreground">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <MessageCircle size={24} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-medium mb-1">WhatsApp</h3>
                    <p className="text-primary-foreground/80 text-sm mb-2">
                      Réponse rapide
                    </p>
                    <a
                      href="https://wa.me/33600000000"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-foreground hover:underline"
                    >
                      Démarrer une conversation
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-card p-8 rounded-2xl shadow-card">
                <h3 className="font-serif text-xl font-medium mb-6">
                  Envoyez-nous un message
                </h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Nom complet</Label>
                    <Input
                      id="contact-name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Votre nom"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email</Label>
                    <Input
                      id="contact-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="votre@email.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-message">Message</Label>
                    <Textarea
                      id="contact-message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Comment pouvons-nous vous aider ?"
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit" variant="romantic" className="w-full">
                    <Send size={18} className="mr-2" />
                    Envoyer le message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
