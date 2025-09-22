"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { ArrowLeft, Download, TrendingUp, Users, BookOpen, Award, Calendar, BarChart3 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface AdminReportsProps {
  onBack: () => void;
}

export function AdminReports({ onBack }: AdminReportsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReportsData();
  }, [selectedPeriod]);

  const loadReportsData = async () => {
    try {
      setIsLoading(true);
      // Simulate loading
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error loading reports data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const chartConfig = {
    users: { label: "Users", color: "#3b82f6" },
    enrollments: { label: "Enrollments", color: "#10b981" },
    completions: { label: "Completions", color: "#f59e0b" },
    time: { label: "Learning Time", color: "#8b5cf6" }
  };

  // Mock data for different time periods
  const getDataForPeriod = () => {
    const baseData = {
      userGrowth: [
        { date: '2024-01-01', newUsers: 45, totalUsers: 1200 },
        { date: '2024-01-02', newUsers: 52, totalUsers: 1252 },
        { date: '2024-01-03', newUsers: 38, totalUsers: 1290 },
        { date: '2024-01-04', newUsers: 67, totalUsers: 1357 },
        { date: '2024-01-05', newUsers: 43, totalUsers: 1400 },
        { date: '2024-01-06', newUsers: 55, totalUsers: 1455 },
        { date: '2024-01-07', newUsers: 71, totalUsers: 1526 }
      ],
      learningActivity: [
        { date: '2024-01-01', enrollments: 125, completions: 45, timeSpent: 2400 },
        { date: '2024-01-02', enrollments: 142, completions: 52, timeSpent: 2750 },
        { date: '2024-01-03', enrollments: 118, completions: 38, timeSpent: 2200 },
        { date: '2024-01-04', enrollments: 167, completions: 67, timeSpent: 3100 },
        { date: '2024-01-05', enrollments: 134, completions: 43, timeSpent: 2600 },
        { date: '2024-01-06', enrollments: 155, completions: 55, timeSpent: 2950 },
        { date: '2024-01-07', enrollments: 171, completions: 71, timeSpent: 3200 }
      ],
      coursePerformance: [
        { courseName: 'JavaScript Fundamentals', enrollments: 892, completions: 456, completionRate: 51.1 },
        { courseName: 'Python for Data Science', enrollments: 756, completions: 298, completionRate: 39.4 },
        { courseName: 'Cybersecurity Basics', enrollments: 634, completions: 267, completionRate: 42.1 },
        { courseName: 'Introduction to AI', enrollments: 523, completions: 189, completionRate: 36.1 },
        { courseName: 'Web Development', enrollments: 445, completions: 201, completionRate: 45.2 }
      ],
      categoryDistribution: [
        { category: 'Programming', enrollments: 2145, percentage: 45.2 },
        { category: 'Cybersecurity', enrollments: 1234, percentage: 26.0 },
        { category: 'AI/ML', enrollments: 891, percentage: 18.8 },
        { category: 'Data Protection', enrollments: 478, percentage: 10.1 }
      ],
      userEngagement: [
        { metric: 'Daily Active Users', value: 1247, change: '+12.5%', trend: 'up' },
        { metric: 'Weekly Active Users', value: 3456, change: '+8.2%', trend: 'up' },
        { metric: 'Avg Session Duration', value: '24 mins', change: '+3.1%', trend: 'up' },
        { metric: 'Course Completion Rate', value: '42.3%', change: '-2.1%', trend: 'down' }
      ]
    };

    return baseData;
  };

  const data = getDataForPeriod();

  const exportReport = (type: string) => {
    let csvContent = '';
    let filename = '';

    switch (type) {
      case 'users':
        csvContent = [
          ['Date', 'New Users', 'Total Users'].join(','),
          ...data.userGrowth.map(row => [row.date, row.newUsers, row.totalUsers].join(','))
        ].join('\n');
        filename = 'user_growth_report.csv';
        break;
      case 'courses':
        csvContent = [
          ['Course Name', 'Enrollments', 'Completions', 'Completion Rate'].join(','),
          ...data.coursePerformance.map(row => [row.courseName, row.enrollments, row.completions, `${row.completionRate}%`].join(','))
        ].join('\n');
        filename = 'course_performance_report.csv';
        break;
      case 'learning':
        csvContent = [
          ['Date', 'Enrollments', 'Completions', 'Time Spent (mins)'].join(','),
          ...data.learningActivity.map(row => [row.date, row.enrollments, row.completions, row.timeSpent].join(','))
        ].join('\n');
        filename = 'learning_activity_report.csv';
        break;
      default:
        return;
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Analytics & Reports</h1>
              <p className="text-slate-600 mt-1">Platform performance insights and metrics</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="1year">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {data.userEngagement.map((metric, index) => (
            <Card key={metric.metric}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.metric}</CardTitle>
                {index === 0 && <Users className="h-4 w-4 text-blue-600" />}
                {index === 1 && <TrendingUp className="h-4 w-4 text-green-600" />}
                {index === 2 && <BarChart3 className="h-4 w-4 text-yellow-600" />}
                {index === 3 && <Award className="h-4 w-4 text-purple-600" />}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className={`text-xs ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change} from last period
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">User Growth</TabsTrigger>
            <TabsTrigger value="learning">Learning Activity</TabsTrigger>
            <TabsTrigger value="courses">Course Performance</TabsTrigger>
            <TabsTrigger value="categories">Category Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>User Registration Growth</CardTitle>
                  <CardDescription>Daily new user registrations and total user count</CardDescription>
                </div>
                <Button variant="outline" onClick={() => exportReport('users')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.userGrowth}>
                      <defs>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area 
                        type="monotone" 
                        dataKey="newUsers" 
                        stroke="#3b82f6" 
                        fillOpacity={1}
                        fill="url(#colorUsers)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="learning" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Learning Activity</CardTitle>
                  <CardDescription>Daily enrollments, completions, and time spent learning</CardDescription>
                </div>
                <Button variant="outline" onClick={() => exportReport('learning')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.learningActivity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="enrollments" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        dot={{ fill: '#10b981', r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="completions" 
                        stroke="#f59e0b" 
                        strokeWidth={3}
                        dot={{ fill: '#f59e0b', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Course Performance</CardTitle>
                  <CardDescription>Enrollment and completion rates by course</CardDescription>
                </div>
                <Button variant="outline" onClick={() => exportReport('courses')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.coursePerformance} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="courseName" type="category" width={150} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="enrollments" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="completions" fill="#10b981" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Course Performance Table */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Course Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.coursePerformance.map((course, index) => (
                    <div key={course.courseName} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900">{course.courseName}</h4>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-slate-600">
                          <span>{course.enrollments} enrollments</span>
                          <span>{course.completions} completions</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">{course.completionRate}%</div>
                        <Badge variant={
                          course.completionRate >= 50 ? 'default' :
                          course.completionRate >= 40 ? 'secondary' : 'destructive'
                        }>
                          {course.completionRate >= 50 ? 'Excellent' :
                           course.completionRate >= 40 ? 'Good' : 'Needs Improvement'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Enrollment Distribution</CardTitle>
                  <CardDescription>Course enrollments by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.categoryDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percentage }) => `${name} (${percentage}%)`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="enrollments"
                        >
                          {data.categoryDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Performance</CardTitle>
                  <CardDescription>Enrollment numbers by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.categoryDistribution.map((category, index) => (
                      <div key={category.category} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-medium">{category.category}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{category.enrollments?.toLocaleString() || 0}</div>
                          <div className="text-sm text-slate-500">{category.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}