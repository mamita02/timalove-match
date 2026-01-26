import { Heart } from "lucide-react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-4xl",
};

const heartSizes = {
  sm: 14,
  md: 18,
  lg: 28,
};

export const Logo = ({ className = "", size = "md" }: LogoProps) => {
  return (
    <div className={`flex items-center gap-1 font-serif font-semibold ${sizeClasses[size]} ${className}`}>
      <span className="text-foreground">Tima</span>
      <Heart 
        size={heartSizes[size]} 
        className="text-primary fill-primary animate-pulse-soft" 
      />
      <span className="text-gradient">Love</span>
    </div>
  );
};
