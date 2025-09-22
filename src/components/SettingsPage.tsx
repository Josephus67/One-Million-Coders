"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { UserProfile } from '../types/course';
import { 
  ArrowLeft,
  User, 
  Bell, 
  Shield, 
  Globe, 
  Download,
  Trash2,
  Award,
  Flame,
  Clock,
  BookOpen
} from 'lucide-react';

interface SettingsPageProps {
  user: UserProfile;
  onBack: () => void;
  onUpdateProfile?: (data: Partial<UserProfile>) => Promise<boolean>;
}

export function SettingsPage({ user, onBack, onUpdateProfile }: SettingsPageProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  });
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    courseReminders: true,
    achievementAlerts: true,
    darkMode: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleProfileUpdate = async () => {
    if (!onUpdateProfile) return;
    
    setIsLoading(true);
    setMessage(null);
    
    try {
      const success = await onUpdateProfile(formData);
      if (success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while updating your profile.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'shortlisted': return 'bg-blue-500';
      case 'admitted': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
            <p className="text-slate-600 mt-1">Manage your account and preferences</p>
          </div>
        </div>

        {message && (
          <Alert className={`mb-6 ${message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Profile Information</span>
                </CardTitle>
                <CardDescription>
                  Update your personal information and account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-blue-500 text-white text-lg">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-slate-900">{user.name}</p>
                    <p className="text-sm text-slate-600">{user.email}</p>
                    <Badge className={`mt-1 ${getStatusColor(user.applicationStatus)} text-white`}>
                      {user.applicationStatus.charAt(0).toUpperCase() + user.applicationStatus.slice(1)}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleProfileUpdate} 
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  {isLoading ? 'Updating...' : 'Update Profile'}
                </Button>
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Notification Preferences</span>
                </CardTitle>
                <CardDescription>
                  Choose how you want to be notified about course updates and achievements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-slate-600">Receive course updates via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked) => 
                      setPreferences({ ...preferences, emailNotifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-slate-600">Get real-time notifications in your browser</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={preferences.pushNotifications}
                    onCheckedChange={(checked) => 
                      setPreferences({ ...preferences, pushNotifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="course-reminders">Course Reminders</Label>
                    <p className="text-sm text-slate-600">Reminders to continue your learning</p>
                  </div>
                  <Switch
                    id="course-reminders"
                    checked={preferences.courseReminders}
                    onCheckedChange={(checked) => 
                      setPreferences({ ...preferences, courseReminders: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="achievement-alerts">Achievement Alerts</Label>
                    <p className="text-sm text-slate-600">Notifications when you earn badges or complete courses</p>
                  </div>
                  <Switch
                    id="achievement-alerts"
                    checked={preferences.achievementAlerts}
                    onCheckedChange={(checked) => 
                      setPreferences({ ...preferences, achievementAlerts: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Privacy & Security</span>
                </CardTitle>
                <CardDescription>
                  Manage your account security and privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Download My Data
                </Button>

                <Separator />

                <Button variant="destructive" className="w-full justify-start">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Stats & Achievements Sidebar */}
          <div className="space-y-6">
            {/* Learning Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Flame className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Current Streak</p>
                    <p className="font-semibold">{user.lastLoginStreak} days</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Total Learning Time</p>
                    <p className="font-semibold">{Math.round(user.totalLearningTime)} minutes</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Enrolled Courses</p>
                    <p className="font-semibold">{user.enrolledCourses.length}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Certificates Earned</p>
                    <p className="font-semibold">{user.certificatesEarned.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Certificates */}
            {user.certificatesEarned.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5" />
                    <span>Recent Certificates</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {user.certificatesEarned.slice(-3).map((certificate) => (
                      <div key={certificate.id} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Award className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm text-slate-900 truncate">{certificate.courseName}</p>
                          <p className="text-xs text-slate-600">
                            {new Date(certificate.completedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    View All Certificates
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Member since</span>
                  <span className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Last login</span>
                  <span className="font-medium">
                    {user.lastLoginDate 
                      ? new Date(user.lastLoginDate).toLocaleDateString()
                      : 'Never'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Longest streak</span>
                  <span className="font-medium">{user.longestStreak} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Aptitude Test</span>
                  <Badge variant={user.aptitudeTestCompleted ? "default" : "secondary"}>
                    {user.aptitudeTestCompleted ? 'Completed' : 'Pending'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}