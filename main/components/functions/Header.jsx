"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ModeToggle } from "@/components/theme/ThemeSwitcher";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import AuthForm from "./AuthForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function Header() {
  const { resolvedTheme } = useTheme();
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const toggleSignup = () => {
    setIsSignupOpen(!isSignupOpen);
  };

  return (
    <header className="fixed text-primary-foreground py-4 lg:px-6 shadow-md backdrop-blur-md bg-opacity-30 top-0 left-0 right-0 z-50 border-b border-border">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/">
          <span className="flex items-center gap-2 text-primary-foreground">
            <img src={resolvedTheme == "light" ? "/Logo6 dark.png" : "/Logo6.png"}
              className="h-5 w-5 sm:h-10 sm:w-10 mr-4"
            />
            <h5 className="text-lg sm:text-xl text-black dark:text-white font-bold relative">
              Coordina
            </h5>
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
                    Agencies
                  </button>
                </li>
              </ul>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
        <DialogContent className="w-11/12 max-w-md sm:w-96">
          <AuthForm />
        </DialogContent>
      </Dialog>
    </header>
  )
}