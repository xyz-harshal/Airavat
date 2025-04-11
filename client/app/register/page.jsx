"use client";
import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "../components/navbar";
import Link from "next/link";
import { registerUser } from "../actions/auth";

export default function CardWithForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const result = await registerUser(formData);
      
      if (result.success) {
        // Store token in localStorage
        localStorage.setItem('token', result.token);
        localStorage.setItem('username', result.username);
        
        // Redirect to dashboard or home page
        router.push('/');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex h-screen items-center justify-center">
        <div className="grid items-center justify-center gap-6 min-h-screen px-4 md:px-6">
          <div className="w-full max-w-sm space-y-4 border border-white-300 shadow-lg rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tighter">
                  Register
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Enter your details below to create a new account
                </p>
              </div>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              
              <div className="space-y-2">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                size="lg" 
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <MailIcon className="mr-2 h-6 w-6" />
                    Register
                  </>
                )}
              </Button>
            </form>
            <div className="space-y-2">
              <Link
                href="/login"
                className="text-center block underline text-sm"
                prefetch={false}
              >
                Already have an account? Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MailIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}