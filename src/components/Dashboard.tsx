"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { CourseRecommendations } from './CourseRecommendations';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  Trophy,
  BookOpen,
  Users,
  TrendingUp,
  GraduationCap,
  FileText,
  Target,
  Brain
} from 'lucide-react';
import { UserProfile, UserProgress } from '../types/course';

type Page = 'login' | 'register' | 'dashboard' | 'courses' | 'enrolled' | 'course-detail' | 'course-learning' | 'settings' | 'notifications';

interface DashboardProps {
  user: UserProfile;
  progress: UserProgress[];
  onNavigate: (page: Page) => void;
  onCourseSelect?: (courseId: string) => void;
  onEnrollCourse?: (courseId: string) => Promise<boolean>;
}

export function Dashboard({ user, progress, onNavigate, onCourseSelect, onEnrollCourse }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate dynamic statistics
  const totalProgress = progress.length > 0 
    ? Math.round(progress.reduce((sum, p) => sum + p.totalProgress, 0) / progress.length)
    : 0;

  const totalLearningHours = Math.round(user.totalLearningTime / 60 * 10) / 10;
  const certificatesCount = user.certificatesEarned?.length || 0;
  const currentStreak = user.lastLoginStreak || 0;

  // Get most recent activity from progress
  const recentActivities = progress
    .filter(p => p.lastWatched)
    .sort((a, b) => new Date(b.lastWatched).getTime() - new Date(a.lastWatched).getTime())
    .slice(0, 3);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'shortlisted': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'admitted': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5" />;
      case 'shortlisted': return <AlertCircle className="w-5 h-5" />;
      case 'admitted': return <CheckCircle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).replace(/[\/,]/g, '-').replace(', ', ' ');
  };

  const applicationSteps = [
    {
      title: 'Application Submitted',
      status: 'completed',
      description: 'Your application has been successfully received and all details captured',
      date: formatDate(user.createdAt)
    },
    {
      title: 'Aptitude Test',
      status: user.aptitudeTestCompleted ? 'completed' : 'pending',
      description: user.aptitudeTestCompleted ? 'Test completed successfully' : 'Complete your aptitude test',
      date: user.aptitudeTestCompleted ? '21-07-25 15:24:16' : null
    },
    {
      title: 'Application Review',
      status: user.applicationStatus === 'pending' ? 'pending' : 'completed',
      description: 'Application under review by admissions team',
      date: user.applicationStatus !== 'pending' ? '25-07-25 09:15:30' : null
    },
    {
      title: 'Admission Decision',
      status: user.applicationStatus === 'admitted' ? 'completed' : 'pending',
      description: user.applicationStatus === 'admitted' ? 'Congratulations! You have been admitted' : 'Awaiting final decision',
      date: user.applicationStatus === 'admitted' ? '28-07-25 14:20:45' : null
    }
  ];

  const stats = [
    {
      title: 'Enrolled Courses',
      value: user.enrolledCourses.length,
      icon: BookOpen,
      color: 'text-blue-600 bg-blue-50',
      change: progress.length > 0 ? `${progress.length} in progress` : 'Start learning!'
    },
    {
      title: 'Learning Progress',
      value: `${totalProgress}%`,
      icon: TrendingUp,
      color: 'text-green-600 bg-green-50',
      change: totalLearningHours > 0 ? `${totalLearningHours}h total` : 'No learning time yet'
    },
    {
      title: 'Certificates Earned',
      value: certificatesCount.toString(),
      icon: Trophy,
      color: 'text-purple-600 bg-purple-50',
      change: certificatesCount > 0 ? 'Well done!' : 'Complete courses to earn'
    },
    {
      title: 'Study Streak',
      value: currentStreak > 0 ? `${currentStreak} day${currentStreak !== 1 ? 's' : ''}` : '0 days',
      icon: Target,
      color: 'text-orange-600 bg-orange-50',
      change: currentStreak > 0 ? 'Keep it up!' : 'Start your streak!'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user.name}! 👋
              </h1>
              <p className="text-gray-600 mt-2">
                Track your progress and manage your learning journey
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={`${getStatusColor(user.applicationStatus)} border font-medium px-3 py-1`}>
                {getStatusIcon(user.applicationStatus)}
                <span className="ml-2 capitalize">{user.applicationStatus}</span>
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.change}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit bg-white shadow-sm">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              For You
            </TabsTrigger>
            <TabsTrigger value="application" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Application
            </TabsTrigger>
            <TabsTrigger value="aptitude" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Aptitude Test
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={() => onNavigate('courses')} 
                    className="w-full justify-start h-12 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Browse New Courses
                  </Button>
                  <Button 
                    onClick={() => onNavigate('enrolled')} 
                    variant="outline" 
                    className="w-full justify-start h-12 border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Continue Learning
                  </Button>
                  {!user.aptitudeTestCompleted && (
                    <Button 
                      variant="outline" 
                      className="w-full justify-start h-12 border-orange-200 text-orange-700 hover:bg-orange-50"
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Complete Aptitude Test
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.length > 0 ? (
                      recentActivities.map((activity, index) => {
                        const timeAgo = Math.round((Date.now() - new Date(activity.lastWatched).getTime()) / (1000 * 60 * 60 * 24));
                        const isCompleted = activity.totalProgress === 100;
                        
                        return (
                          <div key={index} className={`flex items-start gap-3 p-3 rounded-lg border ${
                            isCompleted 
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-blue-50 border-blue-200'
                          }`}>
                            {isCompleted ? (
                              <Trophy className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            ) : (
                              <BookOpen className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            )}
                            <div>
                              <p className={`text-sm font-medium ${
                                isCompleted ? 'text-green-800' : 'text-blue-800'
                              }`}>
                                {isCompleted ? 'Completed' : 'Learning'} Course {activity.courseId}
                              </p>
                              <p className={`text-xs ${
                                isCompleted ? 'text-green-600' : 'text-blue-600'
                              }`}>
                                {timeAgo === 0 ? 'Today' : `${timeAgo} day${timeAgo !== 1 ? 's' : ''} ago`}
                              </p>
                              <div className="mt-1">
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                                    style={{ width: `${activity.totalProgress}%` }}
                                  ></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{activity.totalProgress}% complete</p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-500 mb-2">No recent activity</p>
                        <Button
                          onClick={() => onNavigate('courses')}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Start Learning
                        </Button>
                      </div>
                    )}
                    
                    {/* Show certificates if any */}
                    {user.certificatesEarned && user.certificatesEarned.length > 0 && (
                      <div className="border-t pt-4 mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Certificates</h4>
                        {user.certificatesEarned.slice(0, 2).map((cert, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 border border-purple-200">
                            <Trophy className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-purple-800">{cert.courseName}</p>
                              <p className="text-xs text-purple-600">
                                Completed {new Date(cert.completedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            {onCourseSelect && onEnrollCourse ? (
              <CourseRecommendations
                user={user}
                progress={progress}
                onCourseSelect={onCourseSelect}
                onEnrollCourse={onEnrollCourse}
              />
            ) : (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <Brain className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Recommendations Coming Soon</h3>
                  <p className="text-slate-600">
                    We're preparing personalized course recommendations for you.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="application" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Application Progress
                </CardTitle>
                <p className="text-sm text-gray-600 mt-2">
                  Track your application status and next steps
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {applicationSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.status === 'completed' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {step.status === 'completed' ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <Clock className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1 pb-6 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{step.title}</h3>
                          {step.date && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {step.date}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{step.description}</p>
                        {step.status === 'completed' && (
                          <Badge className="mt-2 bg-green-100 text-green-800 border-green-200">
                            Completed
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="aptitude" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                  Aptitude Test Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Test Details</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Category:</span>
                          <span className="text-sm font-medium">Knowledge Base</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Duration:</span>
                          <span className="text-sm font-medium">30 minutes</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Total Questions:</span>
                          <span className="text-sm font-medium">30</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {user.aptitudeTestCompleted ? (
                      <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                          <h4 className="font-semibold text-green-800">Test Completed!</h4>
                        </div>
                        <p className="text-sm text-green-700 mb-3">
                          You successfully completed the aptitude test on 21-07-25 15:24:16
                        </p>
                        <Badge className="bg-green-600 text-white">
                          Passed
                        </Badge>
                      </div>
                    ) : (
                      <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <AlertCircle className="w-6 h-6 text-blue-600" />
                          <h4 className="font-semibold text-blue-800">Action Required</h4>
                        </div>
                        <p className="text-sm text-blue-700 mb-4">
                          Please complete your aptitude test to proceed with your application.
                        </p>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                          <GraduationCap className="w-4 h-4 mr-2" />
                          Start Aptitude Test
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}