"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import { ModeToggle } from "@/components/theme/ThemeSwitcher";
import Link from "next/link";
import { FlipWords } from "@/components/ui/flip-words";
import { useTheme } from "next-themes";
import Footer from "@/components/functions/Footer";
import Auth from "@/components/functions/signup-form-demo";
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
      <header className="fixed text-primary-foreground py-4 lg:px-6 shadow-md backdrop-blur-md bg-opacity-30 top-0 left-0 right-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/">
            <span className="flex items-center gap-2 text-primary-foreground">
              <img src={`${resolvedTheme === "dark" ? "Logo6.png" : "Logo6 dark.png"}`}
                className="h-5 w-5 sm:h-10 sm:w-10 mr-4"
              />
              <span className="text-lg sm:text-xl text-black dark:text-white font-bold relative">
                CitySync
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <ModeToggle />

            {/* Popover for Get Started Button */}
            <Popover>
              <PopoverTrigger asChild>
                <Button className="font-semibold">Get Started</Button>
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
      <HeroHighlight>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [20, -5, 0] }}
          transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
          className="text-5xl px-4 md:text-6xl lg:text-7xl font-bold text-neutral-700 dark:text-white leading-relaxed lg:leading-snug w-full text-left max-w-fit"
        >
          Transforming India&apos;s Cities:<br /> Accelerating{" "}
          <FlipWords className="p-0" words={words} />
          <br /> For a smarter tomorrow.
        </motion.h1>
      </HeroHighlight>
      
      <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
        <DialogContent className="w-96">
          <Auth /> {/* Render the signup form */}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

export default Landing;