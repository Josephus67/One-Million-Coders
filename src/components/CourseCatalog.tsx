"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { fetchCourses, transformApiCourseToMockCourse, ApiCourse } from '../services/api';
import { Course } from '../types/course';
import { 
  Search, 
  Filter, 
  Clock, 
  Users, 
  Star, 
  BookOpen,
  CheckCircle,
  Play,
  Trophy,
  TrendingUp,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface CourseCatalogProps {
  onCourseSelect: (courseId: string) => void;
  onEnrollCourse: (courseId: string) => void;
  enrolledCourses: string[];
}

const categories = [
  { value: 'all', label: 'All Courses', count: 0 },
  { value: 'web-development', label: 'Web Development', count: 0 },
  { value: 'programming', label: 'Programming', count: 0 },
  { value: 'mobile-development', label: 'Mobile Development', count: 0 },
  { value: 'data-science', label: 'Data Science', count: 0 }
];

export function CourseCatalog({ onCourseSelect, onEnrollCourse, enrolledCourses }: CourseCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load courses from API
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchCourses({
          category: selectedCategory === 'all' ? undefined : selectedCategory,
          level: levelFilter === 'all' ? undefined : levelFilter.toUpperCase(),
          search: searchQuery || undefined,
          limit: 50
        });
        
        const transformedCourses = response.courses.map(transformApiCourseToMockCourse);
        setCourses(transformedCourses);
      } catch (err) {
        console.error('Error loading courses:', err);
        setError('Failed to load courses. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [selectedCategory, levelFilter, searchQuery]);

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'all' || 
      course.category.toLowerCase().replace(' ', '-') === selectedCategory;
    const matchesSearch = !searchQuery || 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLevel = levelFilter === 'all' || 
      course.level.toLowerCase() === levelFilter.toLowerCase();
    
    return matchesCategory && matchesSearch && matchesLevel;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'students':
        return b.students - a.students;
      case 'duration':
        return parseInt(a.duration) - parseInt(b.duration);
      default:
        return b.students - a.students; // popular
    }
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermediate': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Advanced': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                  One Million Coders Program
                </h1>
                <p className="text-blue-100 text-lg">
                  Discover world-class courses designed to advance your tech career
                </p>
              </div>
              <div className="flex items-center gap-4 text-blue-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{courses.length}</div>
                  <div className="text-sm">Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">5K+</div>
                  <div className="text-sm">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-sm">Free</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search courses, technologies, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg bg-white shadow-lg border-0 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                variant={selectedCategory === category.value ? "default" : "outline"}
                className={`h-12 px-6 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category.value
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-blue-300'
                }`}
              >
                {category.label}
                <Badge className="ml-2 bg-gray-100 text-gray-600 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Advanced Filters */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-40 bg-white shadow-sm">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 bg-white shadow-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="students">Most Students</SelectItem>
                <SelectItem value="duration">Shortest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredCourses.length}</span> course{filteredCourses.length !== 1 ? 's' : ''}
            {searchQuery && <span> for "<span className="font-semibold">{searchQuery}</span>"</span>}
          </p>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Loading courses...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-red-500 mb-4">
              <AlertCircle className="w-12 h-12 mx-auto mb-2" />
              <p className="text-lg font-semibold">Error Loading Courses</p>
              <p className="text-gray-600">{error}</p>
            </div>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 hover:bg-blue-700"
            >
              Try Again
            </Button>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-semibold text-gray-600 mb-2">No courses found</p>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="group bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
              <div className="relative overflow-hidden">
                <ImageWithFallback
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <Badge className={`${getLevelColor(course.level)} border font-medium`}>
                    {course.level}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-green-600 text-white border-0 font-semibold">
                    {course.price}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 text-white text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current text-yellow-400" />
                      <span className="font-medium">{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{course.students?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Instructor: <span className="font-medium text-gray-700">{course.instructor || 'Unknown Instructor'}</span></p>
                  <div className="flex flex-wrap gap-2">
                    {course.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-600 hover:bg-gray-200">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => onCourseSelect(course.id)}
                    variant="outline"
                    className="flex-1 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Learn More
                  </Button>
                  
                  {enrolledCourses.includes(course.id) ? (
                    <Button className="bg-green-600 hover:bg-green-700 text-white px-4">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Enrolled
                    </Button>
                  ) : (
                    <Button
                      onClick={() => onEnrollCourse(course.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Enroll
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}