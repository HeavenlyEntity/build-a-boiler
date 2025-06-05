"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";

const ProjectDescription = ({ onDescriptionChange }) => {
  const [description, setDescription] = useState("");

  const handleChange = (value) => {
    setDescription(value);
    if (onDescriptionChange) {
      onDescriptionChange(value);
    }
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="project-description" className="text-sm font-semibold text-foreground">
          Describe your project
        </Label>
        <span className="text-xs text-muted-foreground">
          Tell us what you&apos;re building
        </span>
      </div>
      
      <div className="relative">
        <Textarea
          id="project-description"
          className="min-h-[120px] resize-none"
          placeholder="I'm building a SaaS application for project management with team collaboration features, real-time updates, and subscription billing..."
          value={description}
          onChange={(e) => handleChange(e.target.value)}
          maxLength={500}
        />
        
        {/* Character count indicator */}
        <div className="absolute bottom-3 right-3 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
          {description.length}/500
        </div>
      </div>
      
      {/* Optional: Add some example prompts */}
      {description.length === 0 && (
        <div className="text-xs text-muted-foreground animate-fade-in">
          <span className="font-medium">💡 Examples:</span> E-commerce platform, AI chatbot, portfolio website, mobile app, data dashboard...
        </div>
      )}
    </div>
  );
};

export default ProjectDescription;