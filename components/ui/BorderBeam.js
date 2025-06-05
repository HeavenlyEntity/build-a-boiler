"use client";

import { cn } from "@/libs/utils";

const BorderBeam = ({
  className = "",
  size = 200,
  duration = 15,
  borderWidth = 1.5,
  colorFrom = "#3b82f6",
  colorTo = "#8b5cf6",
  delay = 0,
}) => {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-lg",
        className
      )}
      style={{
        background: `
          linear-gradient(90deg, transparent, transparent),
          linear-gradient(90deg, ${colorFrom}, ${colorTo})
        `,
        backgroundSize: `${size}px ${borderWidth}px, 100% ${borderWidth}px`,
        backgroundPosition: "0 0, 0 0",
        backgroundRepeat: "no-repeat",
        animation: `border-beam ${duration}s linear infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <style jsx>{`
        @keyframes border-beam {
          0% {
            background-position: -${size}px 0, 0 0;
          }
          100% {
            background-position: ${size}px 0, 0 0;
          }
        }
      `}</style>
    </div>
  );
};

export default BorderBeam;