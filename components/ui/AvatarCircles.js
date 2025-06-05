"use client";

import { cn } from "@/libs/utils";

const AvatarCircles = ({ 
  avatarUrls = [], 
  numPeople = 0, 
  className = "",
  size = "md" 
}) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base"
  };

  const marginClasses = {
    sm: "-ml-2",
    md: "-ml-3", 
    lg: "-ml-4"
  };

  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex -space-x-2">
        {avatarUrls.map((url, index) => (
          <div
            key={index}
            className={cn(
              "relative inline-flex items-center justify-center rounded-full border-2 border-background bg-background overflow-hidden",
              sizeClasses[size],
              "hover:scale-110 hover:z-10 transition-all duration-200 cursor-pointer"
            )}
          >
            <img
              src={url}
              alt={`Avatar ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        
        {numPeople > avatarUrls.length && (
          <div
            className={cn(
              "relative inline-flex items-center justify-center rounded-full border-2 border-background bg-muted text-muted-foreground font-medium",
              sizeClasses[size],
              "hover:scale-110 hover:z-10 transition-all duration-200 cursor-pointer"
            )}
          >
            +{numPeople - avatarUrls.length}
          </div>
        )}
      </div>
      
      {numPeople > 0 && (
        <span className="ml-3 text-sm text-muted-foreground">
          {numPeople === 1 ? "1 person" : `${numPeople} people`} joined
        </span>
      )}
    </div>
  );
};

export default AvatarCircles;