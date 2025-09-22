"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { Users, BookOpen, Award, TrendingUp, UserPlus, BarChart3, Settings, Bell } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { AdminStats, UserProfile, Course } from '../types/course';

interface AdminDashboardProps {
  onNavigateToUsers: () => void;
  onNavigateToCourses: () => void;
  onNavigateToReports: () => void;
  onNavigateToSettings: () => void;
}

export function AdminDashboard({
  onNavigateToUsers,
  onNavigateToCourses,
  onNavigateToReports,
  onNavigateToSettings
}: AdminDashboardProps) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setIsLoading(true);
      // Mock data for demo - in real app this would come from backend
      const mockStats: AdminStats = {
        totalUsers: 2547,
        totalCourses: 8,
        totalEnrollments: 4832,
        totalCompletions: 1924,
        newUsersThisWeek: 89,
        completionRate: 39.8,
        popularCourses: [
          { courseId: '1', title: 'JavaScript Fundamentals', enrollments: 892 },
          { courseId: '2', title: 'Python for Data Science', enrollments: 756 },
          { courseId: '3', title: 'Cybersecurity Basics', enrollments: 634 }
        ],
        userGrowth: [
          { date: '2024-01-01', users: 1200 },
          { date: '2024-02-01', users: 1450 },
          { date: '2024-03-01', users: 1680 },
          { date: '2024-04-01', users: 1920 },
          { date: '2024-05-01', users: 2150 },
          { date: '2024-06-01', users: 2400 },
          { date: '2024-07-01', users: 2547 }
        ],
        categoryStats: [
          { category: 'Programming', count: 3245 },
          { category: 'Cybersecurity', count: 1834 },
          { category: 'AI/ML', count: 1245 },
          { category: 'Data Protection', count: 892 }
        ]
      };

      const mockRecentUsers: UserProfile[] = [
        {
          id: '1', name: 'Kwame Asante', email: 'kwame@example.com',
          enrolledCourses: ['1', '2'], applicationStatus: 'admitted',
          aptitudeTestCompleted: true, createdAt: '2024-01-15T00:00:00Z',
          lastLoginStreak: 5, longestStreak: 12, lastLoginDate: '2024-01-20T00:00:00Z',
          totalLearningTime: 240, certificatesEarned: []
        },
        {
          id: '2', name: 'Ama Osei', email: 'ama@example.com',
          enrolledCourses: ['3'], applicationStatus: 'shortlisted',
          aptitudeTestCompleted: true, createdAt: '2024-01-14T00:00:00Z',
          lastLoginStreak: 3, longestStreak: 8, lastLoginDate: '2024-01-19T00:00:00Z',
          totalLearningTime: 180, certificatesEarned: []
        }
      ];

      setStats(mockStats);
      setRecentUsers(mockRecentUsers);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="h-32 animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const chartConfig = {
    users: {
      label: "Users",
      color: "#3b82f6"
    },
    enrollments: {
      label: "Enrollments", 
      color: "#10b981"
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-600 mt-1">Ghana One Million Coders Platform Management</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onNavigateToSettings}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onNavigateToUsers}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalUsers?.toLocaleString() || 0}</div>
              <p className="text-xs text-slate-600">
                <span className="text-green-600">+{stats.newUsersThisWeek || 0}</span> this week
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onNavigateToCourses}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.totalCourses}</div>
              <p className="text-xs text-slate-600">Across 4 categories</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
              <TrendingUp className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.totalEnrollments?.toLocaleString() || 0}</div>
              <p className="text-xs text-slate-600">{((stats.totalEnrollments || 0) / (stats.totalUsers || 1)).toFixed(1)} avg per user</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <Award className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.completionRate}%</div>
              <p className="text-xs text-slate-600">{stats.totalCompletions} completed courses</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <Tabs defaultValue="growth" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="growth">User Growth</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="courses">Popular Courses</TabsTrigger>
          </TabsList>

          <TabsContent value="growth" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Registration Growth</CardTitle>
                <CardDescription>Monthly user registration trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.userGrowth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
                      />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="users" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Enrollment by Category</CardTitle>
                <CardDescription>Distribution of course enrollments across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.categoryStats}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {stats.categoryStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Most Popular Courses</CardTitle>
                <CardDescription>Courses with highest enrollment numbers</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.popularCourses} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="title" type="category" width={150} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="enrollments" fill="#10b981" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent User Registrations</CardTitle>
              <CardDescription>Latest users who joined the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{user.name}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        user.applicationStatus === 'admitted' ? 'default' :
                        user.applicationStatus === 'shortlisted' ? 'secondary' : 'outline'
                      }>
                        {user.applicationStatus}
                      </Badge>
                      <p className="text-xs text-slate-500 mt-1">
                        {user.enrolledCourses.length} courses
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={onNavigateToUsers}>
                View All Users
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex-col" onClick={onNavigateToUsers}>
                  <Users className="h-6 w-6 mb-2" />
                  Manage Users
                </Button>
                <Button variant="outline" className="h-20 flex-col" onClick={onNavigateToCourses}>
                  <BookOpen className="h-6 w-6 mb-2" />
                  Manage Courses
                </Button>
                <Button variant="outline" className="h-20 flex-col" onClick={onNavigateToReports}>
                  <BarChart3 className="h-6 w-6 mb-2" />
                  View Reports
                </Button>
                <Button variant="outline" className="h-20 flex-col" onClick={onNavigateToSettings}>
                  <Settings className="h-6 w-6 mb-2" />
                  Platform Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}