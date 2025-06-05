"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ButtonSignin from "./ButtonSignin";
import logo from "@/app/icon.png";
import config from "@/config";
import { cn } from "@/libs/utils";

const ResizableNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const links = [
    {
      href: "/discover",
      label: "Discover",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      href: "/#pricing",
      label: "Pricing",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      href: "/#testimonials",
      label: "Reviews",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    },
    {
      href: "/#faq",
      label: "FAQ",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{
          height: isScrolled ? 64 : 80,
          backgroundColor: isScrolled ? "rgba(var(--base-100-rgb) / 0.8)" : "transparent",
        }}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 backdrop-blur-md",
          isScrolled && "border-b border-base-200/50 shadow-sm"
        )}
      >
        <nav className="container mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Image
                src={logo}
                alt={`${config.appName} logo`}
                className={cn(
                  "transition-all duration-300",
                  isScrolled ? "w-8 h-8" : "w-10 h-10"
                )}
                width={40}
                height={40}
                priority
              />
            </motion.div>
            <span
              className={cn(
                "font-extrabold transition-all duration-300 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent",
                isScrolled ? "text-lg" : "text-xl"
              )}
            >
              {config.appName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 rounded-lg transition-all duration-200 group",
                  pathname === link.href
                    ? "text-primary"
                    : "text-base-content/70 hover:text-base-content"
                )}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {link.icon}
                  <span className={cn("font-medium", isScrolled ? "text-sm" : "text-base")}>
                    {link.label}
                  </span>
                </span>
                {pathname === link.href && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 bg-primary/10 rounded-lg"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
                <motion.div
                  className="absolute inset-0 bg-base-200/50 rounded-lg opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.2 }}
                />
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <ButtonSignin
                extraStyle={cn(
                  "btn-primary transition-all duration-300",
                  isScrolled ? "btn-sm" : ""
                )}
              />
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-base-200/50 transition-colors"
          >
            <motion.svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </motion.svg>
          </button>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-20 z-40 lg:hidden"
          >
            <div className="mx-4 rounded-2xl bg-base-100/95 backdrop-blur-md border border-base-200/50 shadow-xl p-6">
              <div className="flex flex-col gap-2">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                      pathname === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-base-content/70 hover:bg-base-200/50 hover:text-base-content"
                    )}
                  >
                    {link.icon}
                    <span className="font-medium">{link.label}</span>
                  </Link>
                ))}
                <div className="mt-4 pt-4 border-t border-base-200/50">
                  <ButtonSignin extraStyle="btn-primary w-full" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className={cn("transition-all duration-300", isScrolled ? "h-16" : "h-20")} />
    </>
  );
};

export default ResizableNavbar;