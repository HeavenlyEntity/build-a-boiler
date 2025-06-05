"use client";

import { motion } from "framer-motion";
import { cn } from "@/libs/utils";
import AnimatedCard from "./ui/AnimatedCard";

const BoilerplateCard = ({ boilerplate, index = 0 }) => {
  const {
    name,
    url,
    techStack = [],
    summary,
    confidenceScore,
    source,
    sourceType,
  } = boilerplate;


  const getScoreColor = (score) => {
    if (score >= 80) return "from-green-500 to-emerald-500";
    if (score >= 60) return "from-yellow-500 to-amber-500";
    return "from-red-500 to-rose-500";
  };

  const getSourceIcon = () => {
    switch (sourceType) {
      case "github":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        );
      case "gitlab":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L.4 10.93c-.606.603-.606 1.58 0 2.187l10.479 10.478c.604.603 1.582.603 2.188 0l10.479-10.478c.606-.606.606-1.584 0-2.187zM8.078 8.273l3.922 11.88 3.922-11.88h-7.844z"/>
          </svg>
        );
      case "bitbucket":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.778 1.213c-.424-.006-.772.334-.778.758 0 .045.005.09.014.134l3.263 19.811c.084.499.515.867 1.022.872H19.95c.382.004.708-.271.772-.648l3.27-20.031c.068-.418-.216-.813-.635-.881-.045-.008-.09-.011-.135-.01L.778 1.213zm13.37 10.512h-4.287l-1.244 5.11h3.897l-1.81 6.17-5.687-11.28H9.06l5.088 11.28z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
          </svg>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <AnimatedCard
        hoverable={true}
        glowEffect={true}
        borderBeam={confidenceScore >= 80}
        className="h-full p-6"
      >
        {/* Content wrapper with flex for consistent layout */}
        <div className="h-full flex flex-col">
          {/* Header section */}
          <div className="flex justify-between items-start gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-card-foreground truncate group-hover:text-primary transition-colors duration-300">
                {name}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  {getSourceIcon()}
                  <span className="truncate">{source}</span>
                </div>
              </div>
            </div>
            
            {/* Animated confidence score */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
              className="flex-shrink-0"
            >
              <div className={cn(
                "w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg",
                getScoreColor(confidenceScore)
              )}>
                <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center">
                  <span className="font-bold text-base">{confidenceScore}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Summary - flex-grow to push tech stack down */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-grow">
            {summary}
          </p>

          {/* Tech stack tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {techStack.slice(0, 5).map((tech, techIndex) => (
              <motion.span
                key={techIndex}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + techIndex * 0.05 + 0.2 }}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-primary/10 text-primary border border-primary/20"
              >
                {tech}
              </motion.span>
            ))}
            {techStack.length > 5 && (
              <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-muted text-muted-foreground">
                +{techStack.length - 5}
              </span>
            )}
          </div>

          {/* CTA section */}
          <div className="pt-4 border-t border-border">
            <motion.a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-focus transition-colors"
            >
              <span>View Repository</span>
              <motion.svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </motion.svg>
            </motion.a>
          </div>
        </div>
      </AnimatedCard>
    </motion.div>
  );
};

export default BoilerplateCard;