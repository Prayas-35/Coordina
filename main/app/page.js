"use client";

import React from "react";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { ModeToggle } from "@/components/theme/ThemeSwitcher";
import Link from "next/link";

function Landing() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky text-primary-foreground py-4 lg:px-6 shadow-md backdrop-blur-lg bg-opacity-30 top-0 left-0 right-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/">
            <span className="flex items-center gap-2 text-primary-foreground">
              {/* <HospitalIcon className="h-6 w-6 sm:h-8 sm:w-8 text-black dark:text-white" /> */}
              <span className="text-lg sm:text-xl text-black dark:text-white font-bold relative">
                CitySync
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <ModeToggle />
          </div>
        </div>
      </header>
      <HeroHighlight>
        <motion.h1
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: [20, -5, 0],
          }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0.0, 0.2, 1],
          }}
          className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto ">
          With insomnia, nothing&apos;s real. Everything is far away. Everything
          is a{" "}
          <Highlight className="text-black dark:text-white">
            copy, of a copy, of a copy.
          </Highlight>
        </motion.h1>
      </HeroHighlight>
    </div>
  );
}

export default Landing;