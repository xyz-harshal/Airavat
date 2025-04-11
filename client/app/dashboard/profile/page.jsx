"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/app/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { User, Mail, Phone, MapPin, Briefcase, Calendar, AlertCircle, Camera } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState({
    username: "",
    email: "",
    fullName: "",
    bio: "",
    phone: "",
    location: "",
    company: "",
    joinDate: "January 2023",
    plan: "Pro",
    avatar: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  
  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    // Here we would fetch the user profile data
    // For now, we'll use mock data with the stored username
    setUser(prev => ({
      ...prev,
      username,
      email: `${username}@example.com`,
      fullName: username.charAt(0).toUpperCase() + username.slice(1) + " Smith"
    }));
    
    setLoading(false);
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate API call
    try {
      // In a real app, you'd make an API request to update the user profile
      await new Promise(resolve => setTimeout(resolve, 1000)); // Fake delay
      
      setNotification({
        type: 'success',
        message: 'Profile updated successfully!'
      });
      
      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to update profile. Please try again.'
      });
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account information and preferences
          </p>
        </div>

        {notification && (
          <Alert className={`${notification.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{notification.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
            <AlertDescription>{notification.message}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Summary Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Profile Summary</CardTitle>
              <CardDescription>Your public information</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative mb-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {getInitials(user.fullName || user.username)}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="icon" 
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                  variant="secondary"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold">{user.fullName || user.username}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="mt-2">
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none">
                    {user.plan} Plan
                  </Badge>
                </div>
              </div>

              <div className="w-full space-y-3">
                <div className="flex items-center text-sm">
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>@{user.username}</span>
                </div>
                {user.location && (
                  <div className="flex items-center text-sm">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{user.location}</span>
                  </div>
                )}
                {user.company && (
                  <div className="flex items-center text-sm">
                    <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{user.company}</span>
                  </div>
                )}
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Joined {user.joinDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Edit Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={user.username}
                      onChange={handleInputChange}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={user.email}
                      onChange={handleInputChange}
                      disabled
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={user.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={user.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      name="company"
                      value={user.company}
                      onChange={handleInputChange}
                      placeholder="Enter your company name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={user.location}
                      onChange={handleInputChange}
                      placeholder="Enter your location"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={user.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself"
                    rows={4}
                  />
                </div>
                
                <CardFooter className="px-0 pb-0">
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
