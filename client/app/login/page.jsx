"use client";
import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "../components/navbar";
import Link from "next/link";
import { loginUser } from "../actions/auth";

export default function CardWithForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
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
      const result = await loginUser(formData);
      
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
                  Login
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Enter your credentials below to login to your account
                </p>
              </div>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              
              <div className="space-y-2">
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
                  <span>Logging in...</span>
                ) : (
                  <>
                    <UserIcon className="mr-2 h-6 w-6" />
                    Login
                  </>
                )}
              </Button>
            </form>
            <div className="space-y-2">
              <Link
                href="/register"
                className="text-center block underline text-sm"
                prefetch={false}
              >
                Don't have an account? Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserIcon(props) {
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
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}