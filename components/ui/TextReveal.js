"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/libs/utils";

const TextReveal = ({
  text,
  className = "",
  delay = 0,
  duration = 0.8,
  staggerDelay = 0.1,
  triggerOnce = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(ref.current);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [triggerOnce]);

  const words = text.split(" ");

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      {words.map((word, index) => (
        <span
          key={index}
          className={cn(
            "inline-block transition-all duration-700 ease-out",
            isVisible
              ? "transform translate-y-0 opacity-100"
              : "transform translate-y-full opacity-0"
          )}
          style={{
            transitionDelay: `${delay + index * staggerDelay}s`,
          }}
        >
          {word}
          {index < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </div>
  );
};

export default TextReveal;