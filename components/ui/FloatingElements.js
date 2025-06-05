"use client";

import { cn } from "@/libs/utils";

const FloatingElement = ({
  children,
  className = "",
  delay = 0,
  duration = 3,
  distance = 20,
  direction = "y",
}) => {
  return (
    <div
      className={cn("animate-float", className)}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        "--float-distance": `${distance}px`,
        "--float-direction": direction === "y" ? "translateY" : "translateX",
      }}
    >
      {children}
    </div>
  );
};

const FloatingGrid = ({
  children,
  className = "",
  pattern = "scattered",
}) => {
  return (
    <div className={cn("relative", className)}>
      {/* Background floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {pattern === "scattered" && (
          <>
            <FloatingElement
              delay={0}
              duration={4}
              distance={15}
              className="absolute top-[10%] left-[15%] w-2 h-2 bg-primary/20 rounded-full"
            />
            <FloatingElement
              delay={1}
              duration={5}
              distance={20}
              className="absolute top-[60%] right-[20%] w-3 h-3 bg-blue-500/20 rounded-full"
            />
            <FloatingElement
              delay={2}
              duration={6}
              distance={10}
              className="absolute bottom-[20%] left-[70%] w-1.5 h-1.5 bg-purple-500/20 rounded-full"
            />
            <FloatingElement
              delay={0.5}
              duration={4.5}
              distance={25}
              className="absolute top-[30%] right-[10%] w-2.5 h-2.5 bg-indigo-500/20 rounded-full"
            />
          </>
        )}
        
        {pattern === "grid" && (
          <div className="grid grid-cols-6 gap-8 h-full w-full">
            {Array.from({ length: 24 }).map((_, i) => (
              <FloatingElement
                key={i}
                delay={i * 0.1}
                duration={3 + (i % 3)}
                distance={10 + (i % 10)}
                className="w-1 h-1 bg-primary/10 rounded-full place-self-center"
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export { FloatingElement, FloatingGrid };