"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import { ModeToggle } from "@/components/theme/ThemeSwitcher";
import Link from "next/link";
import { FlipWords } from "@/components/ui/flip-words";
import { useTheme } from "next-themes";
import Footer from "@/components/functions/Footer";
import Auth from "@/components/functions/AuthForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

function Landing() {
  const { resolvedTheme } = useTheme();
  const words = ["Growth", "Innovation", "Technology"];
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const toggleSignup = () => {
    setIsSignupOpen(!isSignupOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed text-primary-foreground py-2 sm:py-4 px-4 lg:px-6 shadow-md backdrop-blur-md bg-opacity-30 top-0 left-0 right-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/">
            <span className="flex items-center gap-2 text-primary-foreground">
              <img 
                src={resolvedTheme == "light" ? "/Logo6 dark.png" : "/Logo6.png"}
                className="h-5 w-5 sm:h-8 sm:w-8 lg:h-10 lg:w-10"
                alt="Logo"
              />
              <span className="text-base sm:text-lg lg:text-xl text-black dark:text-white font-bold relative">
                CitySync
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <ModeToggle />

            <Link href="/about">
              <Button variant="ghost" className='hidden sm:inline-block text-black dark:text-white font-semibold text-sm sm:text-base'>
                About Us
              </Button>
            </Link>

            <Popover>
              <PopoverTrigger asChild>
                <Button className="font-semibold text-sm sm:text-base">Get Started</Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2">
                <ul>
                  <li>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={toggleSignup}
                    >
                      Department
                    </button>
                  </li>
                  <li>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      3rd Party Vendors
                    </button>
                  </li>
                </ul>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>
      <main className="flex-grow pt-16 sm:pt-20 lg:pt-0">
        <HeroHighlight>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: [20, -5, 0] }}
            transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-neutral-700 dark:text-white leading-tight sm:leading-snug lg:leading-relaxed w-full text-left max-w-fit px-4 sm:px-6 lg:px-8"
          >
            Transforming India&apos;s Cities:<br className="hidden sm:inline" /> Accelerating{" "}
            <FlipWords className="p-0" words={words} />
            <br className="hidden sm:inline" /> For a smarter tomorrow.
          </motion.h1>
        </HeroHighlight>
      </main>

      <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
        <DialogContent className="w-11/12 max-w-md sm:w-96">
          <Auth />
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

export default Landing;