"use client";

import { cn } from "@/libs/utils";

const ShineButton = ({ 
  children, 
  className = "", 
  variant = "default",
  ...props 
}) => {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };

  return (
    <button
      className={cn(
        "relative inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden group",
        variants[variant],
        className
      )}
      {...props}
    >
      {/* Shine effect overlay */}
      <div
        className="absolute inset-0 -top-3 -bottom-3 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700 ease-out"
        style={{
          transform: "translateX(-100%) skewX(-12deg)",
        }}
      />
      
      {/* Content */}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default ShineButton;