"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Search, Filter, Download, MoreHorizontal, User, Mail, Calendar, Award, TrendingUp, ArrowLeft } from 'lucide-react';
import { UserProfile, Certificate } from '../types/course';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface AdminUserManagementProps {
  onBack: () => void;
}

export function AdminUserManagement({ onBack }: AdminUserManagementProps) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const filterUsers = useCallback(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.applicationStatus === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, statusFilter]);

  useEffect(() => {
    filterUsers();
  }, [filterUsers]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      // Mock data for demo - in real app this would come from backend
      const mockUsers: UserProfile[] = [
        {
          id: '1',
          name: 'Kwame Asante',
          email: 'kwame.asante@example.com',
          enrolledCourses: ['1', '2', '3'],
          applicationStatus: 'admitted',
          aptitudeTestCompleted: true,
          createdAt: '2024-01-15T00:00:00Z',
          lastLoginStreak: 5,
          longestStreak: 12,
          lastLoginDate: '2024-01-20T00:00:00Z',
          totalLearningTime: 240,
          certificatesEarned: [
            {
              id: 'cert1',
              courseId: '1',
              courseName: 'JavaScript Fundamentals',
              userName: 'Kwame Asante',
              completedAt: '2024-01-18T00:00:00Z',
              certificateUrl: '#'
            }
          ]
        },
        {
          id: '2',
          name: 'Ama Osei',
          email: 'ama.osei@example.com',
          enrolledCourses: ['1', '4'],
          applicationStatus: 'shortlisted',
          aptitudeTestCompleted: true,
          createdAt: '2024-01-14T00:00:00Z',
          lastLoginStreak: 3,
          longestStreak: 8,
          lastLoginDate: '2024-01-19T00:00:00Z',
          totalLearningTime: 180,
          certificatesEarned: []
        },
        {
          id: '3',
          name: 'Kojo Mensah',
          email: 'kojo.mensah@example.com',
          enrolledCourses: ['2', '5'],
          applicationStatus: 'pending',
          aptitudeTestCompleted: false,
          createdAt: '2024-01-13T00:00:00Z',
          lastLoginStreak: 1,
          longestStreak: 3,
          lastLoginDate: '2024-01-18T00:00:00Z',
          totalLearningTime: 95,
          certificatesEarned: []
        },
        {
          id: '4',
          name: 'Akosua Boateng',
          email: 'akosua.boateng@example.com',
          enrolledCourses: ['1', '3', '6'],
          applicationStatus: 'admitted',
          aptitudeTestCompleted: true,
          createdAt: '2024-01-12T00:00:00Z',
          lastLoginStreak: 7,
          longestStreak: 15,
          lastLoginDate: '2024-01-21T00:00:00Z',
          totalLearningTime: 320,
          certificatesEarned: [
            {
              id: 'cert2',
              courseId: '3',
              courseName: 'Cybersecurity Basics',
              userName: 'Akosua Boateng',
              completedAt: '2024-01-19T00:00:00Z',
              certificateUrl: '#'
            }
          ]
        }
      ];

      setUsers(mockUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, newStatus: 'pending' | 'shortlisted' | 'admitted') => {
    try {
      // In real app, this would call the backend
      setUsers(prev => prev.map(user =>
        user.id === userId ? { ...user, applicationStatus: newStatus } : user
      ));
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const exportUsers = () => {
    const csvContent = [
      ['Name', 'Email', 'Status', 'Courses Enrolled', 'Certificates', 'Learning Time', 'Join Date'].join(','),
      ...filteredUsers.map(user => [
        user.name,
        user.email,
        user.applicationStatus,
        user.enrolledCourses.length,
        user.certificatesEarned.length,
        `${user.totalLearningTime} mins`,
        new Date(user.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
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
              <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
              <p className="text-slate-600 mt-1">{filteredUsers.length} users found</p>
            </div>
          </div>
          <Button onClick={exportUsers}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <User className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{users.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admitted</CardTitle>
              <Award className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {users.filter(u => u.applicationStatus === 'admitted').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
              <TrendingUp className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {users.filter(u => u.applicationStatus === 'shortlisted').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Calendar className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {users.filter(u => u.applicationStatus === 'pending').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="admitted">Admitted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage user accounts and application statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aptitude Test</TableHead>
                  <TableHead>Courses</TableHead>
                  <TableHead>Certificates</TableHead>
                  <TableHead>Learning Time</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        user.applicationStatus === 'admitted' ? 'default' :
                        user.applicationStatus === 'shortlisted' ? 'secondary' : 'outline'
                      }>
                        {user.applicationStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.aptitudeTestCompleted ? 'default' : 'destructive'}>
                        {user.aptitudeTestCompleted ? 'Completed' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.enrolledCourses.length}</TableCell>
                    <TableCell>{user.certificatesEarned.length}</TableCell>
                    <TableCell>{user.totalLearningTime} mins</TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateUserStatus(user.id, 'shortlisted')}>
                            Mark as Shortlisted
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateUserStatus(user.id, 'admitted')}>
                            Mark as Admitted
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateUserStatus(user.id, 'pending')}>
                            Mark as Pending
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* User Detail Modal */}
        {selectedUser && (
          <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{selectedUser.name}</DialogTitle>
                <DialogDescription>{selectedUser.email}</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="courses">Courses</TabsTrigger>
                  <TabsTrigger value="certificates">Certificates</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Application Status</p>
                      <Badge variant={
                        selectedUser.applicationStatus === 'admitted' ? 'default' :
                        selectedUser.applicationStatus === 'shortlisted' ? 'secondary' : 'outline'
                      }>
                        {selectedUser.applicationStatus}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">Aptitude Test</p>
                      <Badge variant={selectedUser.aptitudeTestCompleted ? 'default' : 'destructive'}>
                        {selectedUser.aptitudeTestCompleted ? 'Completed' : 'Pending'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">Current Streak</p>
                      <p className="text-lg font-semibold">{selectedUser.lastLoginStreak} days</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">Longest Streak</p>
                      <p className="text-lg font-semibold">{selectedUser.longestStreak} days</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">Total Learning Time</p>
                      <p className="text-lg font-semibold">{selectedUser.totalLearningTime} minutes</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">Join Date</p>
                      <p className="text-lg font-semibold">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="courses">
                  <div>
                    <p className="font-medium mb-2">Enrolled Courses: {selectedUser.enrolledCourses.length}</p>
                    <div className="space-y-2">
                      {selectedUser.enrolledCourses.map((courseId, index) => (
                        <div key={courseId} className="p-3 bg-slate-50 rounded-lg">
                          <p className="font-medium">Course {courseId}</p>
                          <p className="text-sm text-slate-600">Enrolled course #{index + 1}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="certificates">
                  <div>
                    <p className="font-medium mb-2">Certificates Earned: {selectedUser.certificatesEarned.length}</p>
                    {selectedUser.certificatesEarned.length > 0 ? (
                      <div className="space-y-2">
                        {selectedUser.certificatesEarned.map((cert) => (
                          <div key={cert.id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <p className="font-medium text-green-800">{cert.courseName}</p>
                            <p className="text-sm text-green-600">
                              Completed on {new Date(cert.completedAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500">No certificates earned yet</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}