"use client";

import { useState } from "react";
import { cn } from "@/libs/utils";
import BorderBeam from "./BorderBeam";

const AnimatedCard = ({
  children,
  className = "",
  hoverable = true,
  glowEffect = false,
  borderBeam = false,
  ...props
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!hoverable) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm",
        hoverable && "group cursor-pointer",
        glowEffect && "transition-all duration-300 hover:shadow-xl hover:shadow-primary/10",
        className
      )}
      onMouseMove={handleMouseMove}
      {...props}
    >
      {/* Border beam animation */}
      {borderBeam && (
        <BorderBeam className="absolute inset-0" />
      )}
      
      {/* Spotlight effect on hover */}
      {hoverable && (
        <div
          className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1), transparent 40%)`,
          }}
        />
      )}
      
      {/* Glow effect */}
      {glowEffect && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AnimatedCard;