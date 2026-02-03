import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PixelCardProps {
    children: ReactNode;
    className?: string;
    variant?: "primary" | "secondary" | "accent";
    title?: string;
}

export function PixelCard({ children, className, variant = "primary", title }: PixelCardProps) {
    const borderColors = {
        primary: "border-walrus-mint", // Cyan/Blue
        secondary: "border-gray-500", // Gray
        accent: "border-orange-500", // Orange
    };

    const titleColors = {
        primary: "text-walrus-mint",
        secondary: "text-gray-400",
        accent: "text-orange-500",
    };

    return (
        <div className={cn(
            "relative bg-walrus-bg border-4 p-6",
            borderColors[variant],
            className
        )}>
            {title && (
                <div className={cn("mb-4 pb-2 border-b-2", borderColors[variant])}>
                    <h3 className={cn("font-pixel text-sm tracking-widest uppercase", titleColors[variant])}>
                        {title}
                    </h3>
                </div>
            )}
            {children}
        </div>
    );
}
