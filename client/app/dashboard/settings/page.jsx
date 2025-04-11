"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/app/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  AlertCircle, 
  Bell, 
  Shield, 
  Smartphone, 
  Globe, 
  Trash2, 
  LogOut,
  Save
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // Settings state
  const [settings, setSettings] = useState({
    account: {
      email: "",
      language: "english",
      timezone: "utc",
    },
    notifications: {
      emailAlerts: true,
      serviceUpdates: true,
      marketingEmails: false,
      usageReports: true,
      securityAlerts: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: "30",
      loginNotifications: true,
      passwordUpdateInterval: "90"
    },
    appearance: {
      theme: "system",
      compactMode: false,
      highContrast: false
    }
  });
  
  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    // Here we would fetch the user settings
    // For now, we'll use mock data with the stored username
    setSettings(prev => ({
      ...prev,
      account: {
        ...prev.account,
        email: `${username}@example.com`
      }
    }));
    
    setLoading(false);
  }, [router]);

  const handleSettingChange = (section, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [setting]: value
      }
    }));
  };

  const handleSaveSettings = async (section) => {
    setSaving(true);
    
    // Simulate API call
    try {
      // In a real app, you'd make an API request to update settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Fake delay
      
      setNotification({
        type: 'success',
        message: `${section.charAt(0).toUpperCase() + section.slice(1)} settings updated successfully!`
      });
      
      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to update settings. Please try again.'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    // This would typically show a confirmation dialog
    alert("In a real app, this would ask for confirmation and delete the account");
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
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        {notification && (
          <Alert className={`${notification.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{notification.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
            <AlertDescription>{notification.message}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>
          
          {/* Account Settings */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={settings.account.email}
                    onChange={(e) => handleSettingChange('account', 'email', e.target.value)}
                    disabled
                  />
                  <p className="text-sm text-muted-foreground">
                    Contact support to change your email address
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={settings.account.language}
                      onValueChange={(value) => handleSettingChange('account', 'language', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                        <SelectItem value="japanese">Japanese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={settings.account.timezone}
                      onValueChange={(value) => handleSettingChange('account', 'timezone', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                        <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                        <SelectItem value="cst">CST (Central Standard Time)</SelectItem>
                        <SelectItem value="mst">MST (Mountain Standard Time)</SelectItem>
                        <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </Button>
                <Button 
                  onClick={() => handleSaveSettings('account')}
                  disabled={saving}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Control when and how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailAlerts}
                    onCheckedChange={(value) => handleSettingChange('notifications', 'emailAlerts', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Service Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications about service changes and updates
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.serviceUpdates}
                    onCheckedChange={(value) => handleSettingChange('notifications', 'serviceUpdates', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive marketing and promotional emails
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.marketingEmails}
                    onCheckedChange={(value) => handleSettingChange('notifications', 'marketingEmails', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Usage Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Weekly reports about your account usage
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.usageReports}
                    onCheckedChange={(value) => handleSettingChange('notifications', 'usageReports', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Security Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Important alerts about your account security
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.securityAlerts}
                    onCheckedChange={(value) => handleSettingChange('notifications', 'securityAlerts', value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleSaveSettings('notifications')}
                  disabled={saving}
                  className="ml-auto flex items-center gap-2"
                >
                  <Bell className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Notification Preferences'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security and authentication options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.twoFactorAuth}
                    onCheckedChange={(value) => handleSettingChange('security', 'twoFactorAuth', value)}
                  />
                </div>
                
                {settings.security.twoFactorAuth && (
                  <div className="ml-6 mt-2 p-4 bg-muted rounded-md">
                    <p className="text-sm mb-2">
                      Two-factor authentication is enabled. You'll be asked for a verification code when logging in.
                    </p>
                    <Button variant="outline" size="sm">Configure 2FA</Button>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Login Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about new logins to your account
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.loginNotifications}
                    onCheckedChange={(value) => handleSettingChange('security', 'loginNotifications', value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <div className="flex gap-4">
                    <Select
                      value={settings.security.sessionTimeout}
                      onValueChange={(value) => handleSettingChange('security', 'sessionTimeout', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select timeout" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your session will expire after this period of inactivity
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Password Update Interval (days)</Label>
                  <div className="flex gap-4">
                    <Select
                      value={settings.security.passwordUpdateInterval}
                      onValueChange={(value) => handleSettingChange('security', 'passwordUpdateInterval', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select interval" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    How often you'll be prompted to update your password
                  </p>
                </div>
                
                <div className="pt-2">
                  <Button variant="outline" className="w-full">
                    Change Password
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleSaveSettings('security')}
                  disabled={saving}
                  className="ml-auto flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Update Security Settings'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Appearance Settings */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize the look and feel of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme Preference</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div 
                      className={`cursor-pointer border rounded-md p-4 text-center ${settings.appearance.theme === 'light' ? 'border-primary' : 'border-muted'}`}
                      onClick={() => handleSettingChange('appearance', 'theme', 'light')}
                    >
                      <div className="h-20 bg-white dark:bg-gray-200 rounded-md mb-2 flex items-center justify-center">
                        <span className="text-black text-xs">Light Mode</span>
                      </div>
                      <span className="text-sm">Light</span>
                    </div>
                    <div 
                      className={`cursor-pointer border rounded-md p-4 text-center ${settings.appearance.theme === 'dark' ? 'border-primary' : 'border-muted'}`}
                      onClick={() => handleSettingChange('appearance', 'theme', 'dark')}
                    >
                      <div className="h-20 bg-gray-900 rounded-md mb-2 flex items-center justify-center">
                        <span className="text-white text-xs">Dark Mode</span>
                      </div>
                      <span className="text-sm">Dark</span>
                    </div>
                    <div 
                      className={`cursor-pointer border rounded-md p-4 text-center ${settings.appearance.theme === 'system' ? 'border-primary' : 'border-muted'}`}
                      onClick={() => handleSettingChange('appearance', 'theme', 'system')}
                    >
                      <div className="h-20 bg-gradient-to-r from-white to-gray-900 rounded-md mb-2 flex items-center justify-center">
                        <span className="text-gray-800 dark:text-gray-200 text-xs">System</span>
                      </div>
                      <span className="text-sm">System Default</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Compact Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Use a more compact layout to fit more content on screen
                    </p>
                  </div>
                  <Switch
                    checked={settings.appearance.compactMode}
                    onCheckedChange={(value) => handleSettingChange('appearance', 'compactMode', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>High Contrast</Label>
                    <p className="text-sm text-muted-foreground">
                      Increase contrast for better visibility
                    </p>
                  </div>
                  <Switch
                    checked={settings.appearance.highContrast}
                    onCheckedChange={(value) => handleSettingChange('appearance', 'highContrast', value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleSaveSettings('appearance')}
                  disabled={saving}
                  className="ml-auto flex items-center gap-2"
                >
                  <Globe className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Appearance Settings'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Other Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-md">
                <h3 className="text-lg font-medium">Sign out from all devices</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This will log you out from all sessions except the current one
                </p>
                <Button variant="outline" className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Sign Out Everywhere
                </Button>
              </div>
              <div className="p-4 border border-destructive/20 rounded-md">
                <h3 className="text-lg font-medium text-destructive">Delete Account</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This action is irreversible. All your data will be permanently removed.
                </p>
                <Button variant="destructive" className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
