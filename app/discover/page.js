"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StackSelector from "@/components/StackSelector";
import ProjectDescription from "@/components/ProjectDescription";
import BoilerplateCard from "@/components/BoilerplateCard";
import ButtonGradient from "@/components/ButtonGradient";
import ResizableNavbar from "@/components/ResizableNavbar";
import Footer from "@/components/Footer";
import { toast } from "react-hot-toast";
import Link from "next/link";
import AuroraText from "@/components/ui/AuroraText";

export default function DiscoverPage() {
  const [stack, setStack] = useState({
    frontend: "",
    backend: "",
    database: "",
    orm: "",
    auth: "",
    payment: "",
  });
  const [description, setDescription] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [totalAvailable, setTotalAvailable] = useState(0);

  const handleSearch = async () => {
    if (!stack.frontend || !stack.backend) {
      toast.error("Please select both Frontend and Backend technologies");
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      // Step 1: Discover boilerplates
      const discoverResponse = await fetch("/api/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stack, description }),
      });

      if (!discoverResponse.ok) {
        throw new Error("Failed to discover boilerplates");
      }

      const { results: rawResults } = await discoverResponse.json();

      if (rawResults.length === 0) {
        toast.error("No boilerplates found matching your criteria");
        setResults([]);
        setLoading(false);
        return;
      }

      // Step 2: Analyze with Claude
      const analyzeResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          results: rawResults,
          stack,
          description,
        }),
      });

      if (!analyzeResponse.ok) {
        throw new Error("Failed to analyze boilerplates");
      }

      const { results: analyzedResults, isAuthenticated: authStatus, totalAvailable: total } = await analyzeResponse.json();
      setResults(analyzedResults);
      setIsAuthenticated(authStatus);
      setTotalAvailable(total);
      
      if (!authStatus && total > 3) {
        toast.success(`Showing 3 of ${total} results. Sign in to see all!`);
      } else {
        toast.success(`Found ${analyzedResults.length} matching boilerplates!`);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search for boilerplates. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ResizableNavbar />
      <main className="min-h-screen relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        </div>

      {/* Floating orbs animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
        />
      </div>

      <section className="relative max-w-7xl mx-auto px-8 py-12 z-10">
        {/* Header with animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block mb-4"
          >
            <span className="text-6xl">🚀</span>
          </motion.div>
          <h1 className="text-4xl lg:text-6xl font-extrabold mb-4 pb-2">
            <AuroraText
              colors={["#66E3A4", "#3DD68C", "#66E3D9", "#3DC9D6"]}
              speed={0.8}
              className="font-extrabold"
            >
              Build-a-Boiler Discovery Engine
            </AuroraText>
          </h1>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Define your tech stack and let AI find the perfect boilerplate for
            your next project
          </p>
        </motion.div>

        {/* Main form section with glassmorphism effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="backdrop-blur-sm bg-base-200/80 rounded-3xl p-8 mb-12 shadow-2xl border border-base-300/50"
        >
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">1.</span> Select Your Tech Stack
              </h2>
              <StackSelector onStackChange={setStack} />
            </motion.div>

            <div className="divider"></div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">2.</span> Describe Your Project
              </h2>
              <ProjectDescription onDescriptionChange={setDescription} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ButtonGradient
                  title={loading ? "Discovering..." : "Discover Boilerplates"}
                  onClick={handleSearch}
                  isLoading={loading}
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Results section */}
        <AnimatePresence mode="wait">
          {searched && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {loading
                    ? "Analyzing boilerplates with AI..."
                    : results.length > 0
                    ? `Found ${results.length} Matching Boilerplates`
                    : "No Results Found"}
                </h2>
                {results.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-sm text-base-content/70"
                  >
                    Sorted by relevance
                  </motion.div>
                )}
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
                  />
                  <p className="text-base-content/70 animate-pulse">
                    AI is analyzing repositories...
                  </p>
                </div>
              ) : results.length > 0 ? (
                <motion.div
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {results.map((result, index) => (
                    <BoilerplateCard
                      key={index}
                      boilerplate={result}
                      index={index}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12 backdrop-blur-sm bg-base-200/50 rounded-2xl"
                >
                  <p className="text-lg text-base-content/70">
                    Try adjusting your tech stack or description to find more
                    results.
                  </p>
                </motion.div>
              )}

              {/* CTA for unauthenticated users */}
              {!isAuthenticated && results.length >= 3 && totalAvailable > 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-12"
                >
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 p-8 md:p-12 backdrop-blur-sm border border-base-200/50">
                    <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
                    
                    <div className="relative z-10 text-center max-w-2xl mx-auto">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                        className="inline-block mb-4"
                      >
                        <span className="text-5xl">🚀</span>
                      </motion.div>
                      
                      <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Unlock {totalAvailable - 3} More Boilerplates
                      </h3>
                      
                      <p className="text-base-content/70 mb-8 text-lg">
                        Sign in to see all {totalAvailable} curated results and start building your next project with the perfect boilerplate.
                      </p>
                      
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          href="/signin"
                          className="btn btn-primary btn-lg gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Build my Boilerplate
                        </Link>
                      </motion.div>
                      
                      <p className="mt-6 text-sm text-base-content/50">
                        Free to start • No credit card required
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center text-sm text-base-content/50"
        >
          <p>
            Powered by Firecrawl, Sim Studio, and Claude AI
          </p>
          <p className="mt-2">
            Phase 1: Discovery Engine • No ZIP generation yet
          </p>
        </motion.div>
      </section>
    </main>
    <Footer />
    </>
  );
}