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
import { 
  User, Mail, Phone, MapPin, Briefcase, Calendar, AlertCircle, Camera,
  GraduationCap, Building2, FileCheck, Brain, Activity, Award, BookOpen
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState({
    username: "",
    email: "",
    fullName: "",
    bio: "",
    phone: "",
    location: "",
    hospital: "",
    department: "Neurology",
    position: "Neurologist",
    specialization: "Clinical Neurophysiology",
    licenseNumber: "ML-54321",
    yearsOfExperience: "12",
    education: "MD, Neurology",
    joinDate: "January 2023",
    plan: "Clinical Pro",
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
      email: `dr.${username}@neurohospital.org`,
      fullName: "Dr. " + username.charAt(0).toUpperCase() + username.slice(1) + " Harrison"
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

  const handleSelectChange = (name, value) => {
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
        message: 'Clinical profile updated successfully!'
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
    if (!name) return "Dr";
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
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Clinician Profile</h1>
        </div>

        {notification && (
          <Alert className={notification.type === 'error' ? 'bg-destructive/10 text-destructive border-destructive/30' : 'bg-primary/10 text-primary border-primary/30'}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{notification.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
            <AlertDescription>
              {notification.message}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="profile">Personal Info</TabsTrigger>
            <TabsTrigger value="professional">Clinical Credentials</TabsTrigger>
            
          </TabsList>
          
          {/* Personal Information Tab */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
              <Card>
                <CardHeader className="text-center">
                  <div className="flex justify-center">
                    <Avatar className="w-24 h-24 relative group">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="text-2xl">{getInitials(user.fullName)}</AvatarFallback>
                      <div className="absolute bottom-0 right-0 rounded-full bg-primary w-8 h-8 flex items-center justify-center cursor-pointer">
                        <Camera className="h-4 w-4 text-primary-foreground" />
                      </div>
                    </Avatar>
                  </div>
                  <CardTitle className="mt-2">{user.fullName}</CardTitle>
                  <CardDescription>@{user.username}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20 text-primary">
                      {user.plan}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Joined {user.joinDate}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal contact details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Full Name
                        </Label>
                        <Input 
                          id="fullName" 
                          name="fullName" 
                          value={user.fullName} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email
                        </Label>
                        <Input 
                          id="email" 
                          name="email"
                          type="email"
                          value={user.email} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Phone
                        </Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          value={user.phone} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="location" className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Location
                        </Label>
                        <Input 
                          id="location" 
                          name="location" 
                          value={user.location} 
                          onChange={handleInputChange} 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio" className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Professional Bio
                      </Label>
                      <Textarea 
                        id="bio" 
                        name="bio"
                        rows={4}
                        placeholder="Share your background in neurology and EEG analysis..." 
                        value={user.bio} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    
                    <Button type="submit" disabled={saving}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Professional Information Tab */}
          <TabsContent value="professional">
            <Card>
              <CardHeader>
                <CardTitle>Clinical Credentials</CardTitle>
                <CardDescription>
                  Update your professional medical information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hospital" className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Hospital/Institution
                      </Label>
                      <Input 
                        id="hospital" 
                        name="hospital" 
                        value={user.hospital} 
                        onChange={handleInputChange} 
                        placeholder="e.g., University Neurological Center"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="department" className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Department
                      </Label>
                      <Select 
                        value={user.department} 
                        onValueChange={(value) => handleSelectChange('department', value)}
                      >
                        <SelectTrigger id="department">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Neurology">Neurology</SelectItem>
                          <SelectItem value="Neurosurgery">Neurosurgery</SelectItem>
                          <SelectItem value="Neuropsychiatry">Neuropsychiatry</SelectItem>
                          <SelectItem value="Pediatric Neurology">Pediatric Neurology</SelectItem>
                          <SelectItem value="Clinical Neurophysiology">Clinical Neurophysiology</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="position" className="flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        Position
                      </Label>
                      <Select 
                        value={user.position} 
                        onValueChange={(value) => handleSelectChange('position', value)}
                      >
                        <SelectTrigger id="position">
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Neurologist">Neurologist</SelectItem>
                          <SelectItem value="Neurosurgeon">Neurosurgeon</SelectItem>
                          <SelectItem value="Psychiatrist">Psychiatrist</SelectItem>
                          <SelectItem value="Neurophysiologist">Neurophysiologist</SelectItem>
                          <SelectItem value="Neuroscience Researcher">Neuroscience Researcher</SelectItem>
                          <SelectItem value="Medical Student">Medical Student</SelectItem>
                          <SelectItem value="Resident">Resident</SelectItem>
                          <SelectItem value="Fellow">Fellow</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="specialization" className="flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        Specialization
                      </Label>
                      <Select 
                        value={user.specialization} 
                        onValueChange={(value) => handleSelectChange('specialization', value)}
                      >
                        <SelectTrigger id="specialization">
                          <SelectValue placeholder="Select specialization" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Clinical Neurophysiology">Clinical Neurophysiology</SelectItem>
                          <SelectItem value="Epileptology">Epileptology</SelectItem>
                          <SelectItem value="Movement Disorders">Movement Disorders</SelectItem>
                          <SelectItem value="Neuropsychiatry">Neuropsychiatry</SelectItem>
                          <SelectItem value="Headache Medicine">Headache Medicine</SelectItem>
                          <SelectItem value="Sleep Medicine">Sleep Medicine</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="licenseNumber" className="flex items-center gap-2">
                        <FileCheck className="h-4 w-4" />
                        License Number
                      </Label>
                      <Input 
                        id="licenseNumber" 
                        name="licenseNumber" 
                        value={user.licenseNumber} 
                        onChange={handleInputChange} 
                        placeholder="e.g., ML-12345"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="yearsOfExperience" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Years of Experience
                      </Label>
                      <Input 
                        id="yearsOfExperience" 
                        name="yearsOfExperience" 
                        type="number"
                        value={user.yearsOfExperience} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="education" className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Education
                      </Label>
                      <Input 
                        id="education" 
                        name="education" 
                        value={user.education} 
                        onChange={handleInputChange} 
                        placeholder="e.g., MD, Neurology"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        EEG Certification
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-muted/20 p-3 rounded-md border-2 border-dashed flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <FileCheck className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">EEG Certification.pdf</span>
                          </div>
                          <Button variant="outline" size="sm">Upload New</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : 'Update Credentials'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
