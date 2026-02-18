import { cn } from "@/lib/utils";

interface PixelCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "mint" | "purple" | "pink";
}

export function PixelCard({ className, variant = "default", children, ...props }: PixelCardProps) {
  const borderColor = {
    default: "bg-black/40 border-white/10 hover:border-white/30",
    mint: "bg-walrus-mint/5 border-walrus-mint/20 hover:border-walrus-mint/50",
    purple: "bg-walrus-purple/5 border-walrus-purple/20 hover:border-walrus-purple/50",
    pink: "bg-walrus-pink/5 border-walrus-pink/20 hover:border-walrus-pink/50",
  }[variant];

  return (
    <div
      className={cn(
        "relative border-2 bg-walrus-bg/50 backdrop-blur-sm p-6",
        borderColor,
        "before:absolute before:-top-1 before:-left-1 before:h-2 before:w-2 before:bg-current",
        "after:absolute after:-bottom-1 after:-right-1 after:h-2 after:w-2 after:bg-current",
        className
      )}
      {...props}
    >
      {children}
      
      {/* Corner accents */}
      <div className="absolute -top-1 -right-1 h-2 w-2 bg-current" />
      <div className="absolute -bottom-1 -left-1 h-2 w-2 bg-current" />
    </div>
  );
}
