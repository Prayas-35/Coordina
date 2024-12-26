'use client'

import React, { useState } from "react";
import { Input } from "@/components/ui/input_signup";
import { Label } from "@/components/ui/label_signup";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/_contexts/authcontext";
import { useRouter } from "next/navigation";

export default function AuthForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    department: "",
    password: "",
    uid: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleInputChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isSignUp ? "/auth/register" : "/auth/login";
    const body = isSignUp
      ? { username: formData.username, department: formData.department, password: formData.password }
      : { uid: formData.uid, password: formData.password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await response.json();

      if (response.ok) {
        const { token } = data;
        login(token);
        router.push("/home");
        console.log(data.token);
        // alert(`${isSignUp ? "Sign up" : "Login"} successful`);
      } else {
        setError(data.message || "An error occurred");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = (mode: any) => {
    setIsSignUp(mode);
    setFormData({
      username: "",
      department: "",
      password: "",
      uid: ""
    });
    setError("");
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="flex bg-muted rounded-lg p-1 mt-4">
        <Button
          variant={isSignUp ? "default" : "ghost"}
          className="flex-1 rounded-md"
          onClick={() => toggleAuthMode(true)}
        >
          Sign Up
        </Button>
        <Button
          variant={!isSignUp ? "default" : "ghost"}
          className="flex-1 rounded-md"
          onClick={() => toggleAuthMode(false)}
        >
          Login
        </Button>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center">{isSignUp ? "Sign up" : "Login"}</h2>
        
        {/* Sign Up Fields */}
        {isSignUp && (
          <>
            <LabelInputContainer>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Your username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                placeholder="Electric Department"
                type="text"
                value={formData.department}
                onChange={handleInputChange}
                required
              />
            </LabelInputContainer>
          </>
        )}

        {/* Login Fields */}
        {!isSignUp && (
          <LabelInputContainer>
            <Label htmlFor="uid">Unique Id</Label>
            <Input
              id="uid"
              placeholder="abcd1234"
              type="text"
              value={formData.uid}
              onChange={handleInputChange}
              required
            />
          </LabelInputContainer>
        )}

        {/* Password Field for Both Login and Sign Up */}
        <LabelInputContainer>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </LabelInputContainer>

        {error && <p className="text-red-500">{error}</p>}

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
          disabled={loading}
        >
          {loading ? "Processing..." : `${isSignUp ? "Sign up" : "Login"} →`}
          <BottomGradient />
        </button>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({ children, className }: any) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
