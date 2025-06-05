import TestimonialsAvatars from "./TestimonialsAvatars";
import Link from "next/link";
import ShineButton from "./ui/ShineButton";
import TextReveal from "./ui/TextReveal";
import { FloatingGrid } from "./ui/FloatingElements";

const Hero = () => {
  return (
    
    <FloatingGrid pattern="scattered" className="max-w-7xl mx-auto bg-background flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 px-8 py-8 lg:py-20">
      <div className="flex flex-col gap-10 lg:gap-14 items-center justify-center text-center lg:text-left lg:items-start">
        <div className="badge-secondary px-4 py-2 text-sm font-medium rounded-full">
          🚀 Phase 1: Discovery Engine Live
        </div>

        <TextReveal
          text="Find Your Perfect Boilerplate with AI"
          className="font-extrabold text-4xl lg:text-6xl tracking-tight md:-mb-4 text-center lg:text-left"
          delay={0.2}
        />
        <p className="text-lg opacity-80 leading-relaxed">
          Define your tech stack and let our AI-powered engine discover the best
          boilerplates from GitHub and across the web. Get curated results with
          confidence scores and summaries.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/discover">
            <ShineButton className="px-8" variant="default">
              ✨ Start Discovering
            </ShineButton>
          </Link>
          <ShineButton className="px-8" variant="outline">
            🎯 How it Works
          </ShineButton>
        </div>

        <TestimonialsAvatars priority={true} />
      </div>
      <div className="lg:w-full">
        <div className="border border-border bg-muted rounded-lg overflow-hidden">
          <div className="bg-muted-foreground/10 p-4 border-b border-border">
            <div className="bg-background border border-border rounded px-3 py-2 text-sm text-muted-foreground text-center">buildaboiler.com/discover</div>
          </div>
          <div className="flex justify-center px-4 py-16 bg-card">
            <div className="text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2">AI-Powered Discovery</h3>
              <p className="text-muted-foreground">
                Select your stack → Get curated boilerplates → Start building
              </p>
            </div>
          </div>
        </div>
      </div>
    </FloatingGrid>
  );
};

export default Hero;
