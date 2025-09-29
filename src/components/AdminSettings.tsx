"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, Save, Settings, Users, Bell, Shield, Database, Mail, Globe } from 'lucide-react';
import { toast } from 'sonner';

interface AdminSettingsProps {
  onBack: () => void;
}

export function AdminSettings({ onBack }: AdminSettingsProps) {
  const [platformSettings, setPlatformSettings] = useState({
    platformName: 'Ghana One Million Coders',
    platformDescription: 'Empowering Ghana with digital skills for the future',
    logoUrl: '',
    primaryColor: '#3b82f6',
    secondaryColor: '#10b981',
    allowUserRegistration: true,
    requireEmailVerification: true,
    enableGoogleAuth: false,
    enableFacebookAuth: false,
    maxCoursesPerUser: 10,
    certificateEnabled: true,
    maintenanceMode: false
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: true,
    courseReminders: true,
    marketingEmails: false,
    systemAlerts: true,
    enrollmentNotifications: true,
    completionNotifications: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    passwordMinLength: 8,
    requireSpecialCharacters: true,
    requireNumbers: true,
    requireUppercase: true,
    sessionTimeout: 24,
    maxLoginAttempts: 5,
    twoFactorAuth: false,
    ipWhitelist: '',
    adminApprovalRequired: false
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: '',
    smtpPort: '587',
    smtpUsername: '',
    smtpPassword: '',
    fromEmail: 'noreply@ghanamillioncoders.com',
    fromName: 'Ghana One Million Coders',
    useSSL: true
  });

  const saveSettings = async (settingType: string) => {
    try {
      // In real app, this would call the backend
      console.error(`Saving ${settingType} settings...`);
      
      toast.success(`${settingType} settings saved successfully!`);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings. Please try again.');
    }
  };

  const testEmailConnection = async () => {
    try {
      // In real app, this would test the email configuration
      toast.success('Email connection test successful!');
    } catch (error) {
      toast.error('Email connection test failed. Please check your settings.');
    }
  };

  const exportSettings = () => {
    const settings = {
      platform: platformSettings,
      notifications: notificationSettings,
      security: securitySettings,
      email: emailSettings
    };

    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'platform_settings.json';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
      // Reset all settings to defaults
      setPlatformSettings({
        platformName: 'Ghana One Million Coders',
        platformDescription: 'Empowering Ghana with digital skills for the future',
        logoUrl: '',
        primaryColor: '#3b82f6',
        secondaryColor: '#10b981',
        allowUserRegistration: true,
        requireEmailVerification: true,
        enableGoogleAuth: false,
        enableFacebookAuth: false,
        maxCoursesPerUser: 10,
        certificateEnabled: true,
        maintenanceMode: false
      });
      toast.success('Settings reset to defaults');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Platform Settings</h1>
              <p className="text-slate-600 mt-1">Configure platform behavior and preferences</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={exportSettings}>
              Export Settings
            </Button>
            <Button variant="outline" onClick={resetToDefaults}>
              Reset to Defaults
            </Button>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="platform" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="platform" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Platform</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </TabsTrigger>
          </TabsList>

          {/* Platform Settings */}
          <TabsContent value="platform" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>General Platform Settings</span>
                </CardTitle>
                <CardDescription>Configure basic platform information and appearance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="platformName">Platform Name</Label>
                    <Input
                      id="platformName"
                      value={platformSettings.platformName}
                      onChange={(e) => setPlatformSettings(prev => ({ ...prev, platformName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input
                      id="logoUrl"
                      value={platformSettings.logoUrl}
                      onChange={(e) => setPlatformSettings(prev => ({ ...prev, logoUrl: e.target.value }))}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                  <div>
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <Input
                      id="primaryColor"
                      type="color"
                      value={platformSettings.primaryColor}
                      onChange={(e) => setPlatformSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={platformSettings.secondaryColor}
                      onChange={(e) => setPlatformSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="platformDescription">Platform Description</Label>
                  <Textarea
                    id="platformDescription"
                    value={platformSettings.platformDescription}
                    onChange={(e) => setPlatformSettings(prev => ({ ...prev, platformDescription: e.target.value }))}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Registration & Features</CardTitle>
                <CardDescription>Control user registration and platform features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Allow User Registration</Label>
                      <p className="text-sm text-slate-500">Enable new users to register</p>
                    </div>
                    <Switch
                      checked={platformSettings.allowUserRegistration}
                      onCheckedChange={(checked) => setPlatformSettings(prev => ({ ...prev, allowUserRegistration: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Verification Required</Label>
                      <p className="text-sm text-slate-500">Require email verification for new accounts</p>
                    </div>
                    <Switch
                      checked={platformSettings.requireEmailVerification}
                      onCheckedChange={(checked) => setPlatformSettings(prev => ({ ...prev, requireEmailVerification: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Google Authentication</Label>
                      <p className="text-sm text-slate-500">Enable Google OAuth login</p>
                    </div>
                    <Switch
                      checked={platformSettings.enableGoogleAuth}
                      onCheckedChange={(checked) => setPlatformSettings(prev => ({ ...prev, enableGoogleAuth: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Certificate Generation</Label>
                      <p className="text-sm text-slate-500">Enable automatic certificate generation</p>
                    </div>
                    <Switch
                      checked={platformSettings.certificateEnabled}
                      onCheckedChange={(checked) => setPlatformSettings(prev => ({ ...prev, certificateEnabled: checked }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="maxCourses">Max Courses per User</Label>
                    <Input
                      id="maxCourses"
                      type="number"
                      value={platformSettings.maxCoursesPerUser}
                      onChange={(e) => setPlatformSettings(prev => ({ ...prev, maxCoursesPerUser: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-slate-500">Put platform in maintenance mode</p>
                    </div>
                    <Switch
                      checked={platformSettings.maintenanceMode}
                      onCheckedChange={(checked) => setPlatformSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                    />
                  </div>
                </div>
                <Button onClick={() => saveSettings('Platform')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Platform Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Configure platform-wide notification settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-slate-500">Send notifications via email</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-slate-500">Send browser push notifications</p>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Weekly Digest</Label>
                      <p className="text-sm text-slate-500">Send weekly progress digest emails</p>
                    </div>
                    <Switch
                      checked={notificationSettings.weeklyDigest}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, weeklyDigest: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Course Reminders</Label>
                      <p className="text-sm text-slate-500">Remind users to continue courses</p>
                    </div>
                    <Switch
                      checked={notificationSettings.courseReminders}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, courseReminders: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enrollment Notifications</Label>
                      <p className="text-sm text-slate-500">Notify when users enroll in courses</p>
                    </div>
                    <Switch
                      checked={notificationSettings.enrollmentNotifications}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, enrollmentNotifications: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Completion Notifications</Label>
                      <p className="text-sm text-slate-500">Notify when users complete courses</p>
                    </div>
                    <Switch
                      checked={notificationSettings.completionNotifications}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, completionNotifications: checked }))}
                    />
                  </div>
                </div>
                <Button onClick={() => saveSettings('Notification')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Password & Security Requirements</CardTitle>
                <CardDescription>Configure password complexity and security measures</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                    <Input
                      id="passwordMinLength"
                      type="number"
                      value={securitySettings.passwordMinLength}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordMinLength: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Require Special Characters</Label>
                      <p className="text-sm text-slate-500">Passwords must contain special characters</p>
                    </div>
                    <Switch
                      checked={securitySettings.requireSpecialCharacters}
                      onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, requireSpecialCharacters: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Require Numbers</Label>
                      <p className="text-sm text-slate-500">Passwords must contain numbers</p>
                    </div>
                    <Switch
                      checked={securitySettings.requireNumbers}
                      onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, requireNumbers: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Require Uppercase</Label>
                      <p className="text-sm text-slate-500">Passwords must contain uppercase letters</p>
                    </div>
                    <Switch
                      checked={securitySettings.requireUppercase}
                      onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, requireUppercase: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-slate-500">Require 2FA for admin accounts</p>
                    </div>
                    <Switch
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, twoFactorAuth: checked }))}
                    />
                  </div>
                </div>
                <Button onClick={() => saveSettings('Security')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Security Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Settings */}
          <TabsContent value="email" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SMTP Configuration</CardTitle>
                <CardDescription>Configure email server settings for notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      value={emailSettings.smtpHost}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpHost: e.target.value }))}
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      value={emailSettings.smtpPort}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPort: e.target.value }))}
                      placeholder="587"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpUsername">Username</Label>
                    <Input
                      id="smtpUsername"
                      value={emailSettings.smtpUsername}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpUsername: e.target.value }))}
                      placeholder="your-email@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPassword">Password</Label>
                    <Input
                      id="smtpPassword"
                      type="password"
                      value={emailSettings.smtpPassword}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPassword: e.target.value }))}
                      placeholder="App password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fromEmail">From Email</Label>
                    <Input
                      id="fromEmail"
                      value={emailSettings.fromEmail}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, fromEmail: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fromName">From Name</Label>
                    <Input
                      id="fromName"
                      value={emailSettings.fromName}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, fromName: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Use SSL/TLS</Label>
                    <p className="text-sm text-slate-500">Enable secure connection</p>
                  </div>
                  <Switch
                    checked={emailSettings.useSSL}
                    onCheckedChange={(checked) => setEmailSettings(prev => ({ ...prev, useSSL: checked }))}
                  />
                </div>
                <div className="flex space-x-3">
                  <Button onClick={() => saveSettings('Email')}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Email Settings
                  </Button>
                  <Button variant="outline" onClick={testEmailConnection}>
                    Test Connection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}