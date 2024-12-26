"use client";

import React from 'react';
import { motion } from "framer-motion";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import Auth from "@/components/functions/agency/AuthForm";

function AuthPage() {
    return (
        <HeroHighlight>
            <div className="p-8 bg-transparent border-4 rounded-lg shadow-md w-full max-w-md mx-auto">
                <Auth />
            </div>
        </HeroHighlight>
    );
}

export default AuthPage;