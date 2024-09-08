'use client'

import React, { useState } from "react"
import { Input } from "@/components/ui/input_signup"
import { Label } from "@/components/ui/label_signup"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button";

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(true)

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log((isSignUp ? "Sign up" : "Login") + " form submitted")
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="flex bg-muted rounded-lg p-1 mt-4">
        <Button
          variant={isSignUp ? "default" : "ghost"}
          className="flex-1 rounded-md"
          onClick={() => setIsSignUp(true)}
        >
          Sign Up
        </Button>
        <Button
          variant={!isSignUp ? "default" : "ghost"}
          className="flex-1 rounded-md"
          onClick={() => setIsSignUp(false)}
        >
          Login
        </Button>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold">{isSignUp ? "Sign up" : "Login"}</h2>
        <LabelInputContainer>
          <Label htmlFor="uid">Unique Id</Label>
          <Input id="uid" placeholder="abcd1234" type="text" />
        </LabelInputContainer>
        {isSignUp && (
          <LabelInputContainer>
            <Label htmlFor="department">Department</Label>
            <Input id="dept" placeholder="Electric Department" type="text" />
          </LabelInputContainer>
        )}
        <LabelInputContainer>
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" />
        </LabelInputContainer>
        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          {isSignUp ? "Sign up" : "Login"} →
          <BottomGradient />
        </button>

      </form>
    </div>
  )
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  )
}