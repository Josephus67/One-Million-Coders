"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, Plus, Edit, Trash2, Users, Play, Star, MoreHorizontal, BookOpen, Clock } from 'lucide-react';
import { Course, Lesson } from '../types/course';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { mockCourses } from '../data/mockCourses';

interface AdminCourseManagementProps {
  onBack: () => void;
}

interface NewCourse {
  title: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  instructor: string;
  image: string;
  duration: string;
  price: string;
  tags: string;
}

interface NewLesson {
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
}

export function AdminCourseManagement({ onBack }: AdminCourseManagementProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [newCourse, setNewCourse] = useState<NewCourse>({
    title: '',
    description: '',
    category: '',
    level: 'Beginner',
    instructor: '',
    image: '',
    duration: '',
    price: '',
    tags: ''
  });

  const [newLesson, setNewLesson] = useState<NewLesson>({
    title: '',
    description: '',
    videoUrl: '',
    duration: ''
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setIsLoading(true);
      // Using mock data for demo
      setCourses(mockCourses);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createCourse = async () => {
    try {
      const course: Course = {
        id: `course-${Date.now()}`,
        title: newCourse.title,
        description: newCourse.description,
        category: newCourse.category,
        level: newCourse.level,
        instructor: newCourse.instructor,
        image: newCourse.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
        duration: newCourse.duration,
        price: newCourse.price,
        tags: newCourse.tags.split(',').map(tag => tag.trim()),
        lessons: [],
        totalLessons: 0,
        completedLessons: 0,
        rating: 0,
        students: 0
      };

      setCourses(prev => [...prev, course]);
      setNewCourse({
        title: '',
        description: '',
        category: '',
        level: 'Beginner',
        instructor: '',
        image: '',
        duration: '',
        price: '',
        tags: ''
      });
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const updateCourse = async () => {
    if (!selectedCourse) return;

    try {
      const updatedCourse: Course = {
        ...selectedCourse,
        title: newCourse.title,
        description: newCourse.description,
        category: newCourse.category,
        level: newCourse.level,
        instructor: newCourse.instructor,
        image: newCourse.image || selectedCourse.image,
        duration: newCourse.duration,
        price: newCourse.price,
        tags: newCourse.tags.split(',').map(tag => tag.trim())
      };

      setCourses(prev => prev.map(course =>
        course.id === selectedCourse.id ? updatedCourse : course
      ));
      setIsEditModalOpen(false);
      setSelectedCourse(null);
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const deleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      setCourses(prev => prev.filter(course => course.id !== courseId));
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const addLesson = async () => {
    if (!selectedCourse) return;

    try {
      const lesson: Lesson = {
        id: `lesson-${Date.now()}`,
        title: newLesson.title,
        description: newLesson.description,
        videoUrl: newLesson.videoUrl,
        duration: newLesson.duration,
        order: selectedCourse.lessons.length + 1,
        isCompleted: false,
        watchProgress: 0
      };

      const updatedCourse = {
        ...selectedCourse,
        lessons: [...selectedCourse.lessons, lesson],
        totalLessons: selectedCourse.lessons.length + 1
      };

      setCourses(prev => prev.map(course =>
        course.id === selectedCourse.id ? updatedCourse : course
      ));
      setSelectedCourse(updatedCourse);
      setNewLesson({
        title: '',
        description: '',
        videoUrl: '',
        duration: ''
      });
      setIsLessonModalOpen(false);
    } catch (error) {
      console.error('Error adding lesson:', error);
    }
  };

  const openEditModal = (course: Course) => {
    setSelectedCourse(course);
    setNewCourse({
      title: course.title,
      description: course.description,
      category: course.category,
      level: course.level,
      instructor: course.instructor,
      image: course.image,
      duration: course.duration,
      price: course.price,
      tags: course.tags.join(', ')
    });
    setIsEditModalOpen(true);
  };

  const openLessonModal = (course: Course) => {
    setSelectedCourse(course);
    setIsLessonModalOpen(true);
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

  const categories = ['Programming', 'Cybersecurity', 'AI/ML', 'Data Protection'];

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
              <h1 className="text-3xl font-bold text-slate-900">Course Management</h1>
              <p className="text-slate-600 mt-1">{courses.length} courses available</p>
            </div>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{courses.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
              <Play className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {courses.reduce((sum, course) => sum + course.lessons.length, 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {(courses.reduce((sum, course) => sum + course.rating, 0) / courses.length || 0).toFixed(1)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {courses.reduce((sum, course) => sum + course.students, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses Table */}
        <Card>
          <CardHeader>
            <CardTitle>Courses</CardTitle>
            <CardDescription>Manage course content and settings</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Lessons</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-slate-900">{course.title}</p>
                          <p className="text-sm text-slate-500">{course.instructor?.name || 'Unknown Instructor'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{course.category?.name || course.category || 'Uncategorized'}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        course.level === 'Beginner' ? 'default' :
                        course.level === 'Intermediate' ? 'secondary' : 'destructive'
                      }>
                        {course.level}
                      </Badge>
                    </TableCell>
                    <TableCell>{course.lessons.length}</TableCell>
                    <TableCell>{course.students}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{course.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => openEditModal(course)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Course
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openLessonModal(course)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Lesson
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => deleteCourse(course.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Course
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

        {/* Create Course Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
              <DialogDescription>Add a new course to the platform</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Course Title</Label>
                <Input
                  id="title"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter course title"
                />
              </div>
              <div>
                <Label htmlFor="instructor">Instructor</Label>
                <Input
                  id="instructor"
                  value={newCourse.instructor}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, instructor: e.target.value }))}
                  placeholder="Instructor name"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newCourse.category} onValueChange={(value) => setNewCourse(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="level">Level</Label>
                <Select value={newCourse.level} onValueChange={(value) => setNewCourse(prev => ({ ...prev, level: value as any }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={newCourse.duration}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="e.g., 8 hours"
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  value={newCourse.price}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="e.g., Free or $99"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newCourse.description}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Course description"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={newCourse.image}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="Course image URL"
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={newCourse.tags}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="javascript, programming, web"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createCourse}>Create Course</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Course Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Course</DialogTitle>
              <DialogDescription>Update course information</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-title">Course Title</Label>
                <Input
                  id="edit-title"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="edit-instructor">Instructor</Label>
                <Input
                  id="edit-instructor"
                  value={newCourse.instructor}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, instructor: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select value={newCourse.category} onValueChange={(value) => setNewCourse(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-level">Level</Label>
                <Select value={newCourse.level} onValueChange={(value) => setNewCourse(prev => ({ ...prev, level: value as any }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={newCourse.description}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={updateCourse}>Update Course</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Lesson Modal */}
        <Dialog open={isLessonModalOpen} onOpenChange={setIsLessonModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Lesson</DialogTitle>
              <DialogDescription>
                Add a new lesson to {selectedCourse?.title}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="lesson-title">Lesson Title</Label>
                <Input
                  id="lesson-title"
                  value={newLesson.title}
                  onChange={(e) => setNewLesson(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter lesson title"
                />
              </div>
              <div>
                <Label htmlFor="lesson-description">Description</Label>
                <Textarea
                  id="lesson-description"
                  value={newLesson.description}
                  onChange={(e) => setNewLesson(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Lesson description"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="lesson-video">Video URL</Label>
                <Input
                  id="lesson-video"
                  value={newLesson.videoUrl}
                  onChange={(e) => setNewLesson(prev => ({ ...prev, videoUrl: e.target.value }))}
                  placeholder="YouTube video URL"
                />
              </div>
              <div>
                <Label htmlFor="lesson-duration">Duration (seconds)</Label>
                <Input
                  id="lesson-duration"
                  type="text"
                  value={newLesson.duration}
                  onChange={(e) => setNewLesson(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="Duration (e.g., 10:30)"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsLessonModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addLesson}>Add Lesson</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}