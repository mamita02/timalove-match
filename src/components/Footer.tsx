import { Logo } from "./Logo";
import { Heart } from "lucide-react";

const footerLinks = {
  navigation: [
    { label: "Accueil", href: "#" },
    { label: "Comment ça marche", href: "#concept" },
    { label: "Galerie", href: "#galerie" },
    { label: "Inscription", href: "#inscription" },
  ],
  legal: [
    { label: "Mentions légales", href: "#" },
    { label: "CGU", href: "#" },
    { label: "Politique de confidentialité", href: "#" },
  ],
};

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Logo size="lg" className="mb-4" />
            <p className="text-muted-foreground max-w-md mb-6">
              TimaLove vous accompagne dans votre recherche d'une relation sérieuse 
              orientée vers le mariage. Un service humain, haut de gamme et personnalisé.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Fait avec</span>
              <Heart size={14} className="text-primary fill-primary" />
              <span>pour de vraies rencontres</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-4">Navigation</h4>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-4">Légal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} TimaLove. Tous droits réservés.
            </p>
            <p className="text-sm text-muted-foreground">
              Service de mise en relation - Non obligation de résultat
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
