import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getCourseById } from '../data/mockCourses';
import { UserProgress, UserProfile } from '../types/course';
import { 
  Play, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Award,
  Target
} from 'lucide-react';

interface EnrolledCoursesProps {
  user: UserProfile;
  progress: UserProgress[];
  onCourseSelect: (courseId: string) => void;
}

export function EnrolledCourses({ user, progress, onCourseSelect }: EnrolledCoursesProps) {
  const enrolledCourseDetails = user.enrolledCourses.map(courseId => {
    const course = getCourseById(courseId);
    const courseProgress = progress.find(p => p.courseId === courseId);
    
    if (!course) return null;
    
    // Calculate real progress
    const totalProgress = courseProgress?.totalProgress || 0;
    const completedLessons = courseProgress?.completedLessons.length || 0;
    const timeSpent = courseProgress?.timeSpent || 0;
    
    return {
      ...course,
      progress: totalProgress,
      completedLessons,
      currentLesson: courseProgress?.currentLesson,
      lastWatched: courseProgress?.lastWatched,
      timeSpent: Math.round(timeSpent / 60 * 10) / 10, // Convert to hours
      enrolledAt: courseProgress?.enrolledAt
    };
  }).filter(Boolean);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Not started';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

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
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 shadow-xl">
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
              My Learning Journey
            </h1>
            <p className="text-blue-100 text-lg">
              Continue your progress and achieve your goals
            </p>
          </div>
          
          {/* Learning Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {enrolledCourseDetails.length}
              </div>
              <div className="text-blue-100 text-sm">Enrolled Courses</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {enrolledCourseDetails.reduce((acc, course) => course ? acc + course.completedLessons : acc, 0)}
              </div>
              <div className="text-blue-100 text-sm">Lessons Completed</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {Math.round(enrolledCourseDetails.reduce((acc, course) => course ? acc + course.progress : acc, 0) / Math.max(enrolledCourseDetails.length, 1))}%
              </div>
              <div className="text-blue-100 text-sm">Average Progress</div>
            </div>
          </div>
        </div>

        {/* Enrolled Courses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {enrolledCourseDetails.filter(course => course !== null).map((course) => (
            <Card key={course.id} className="overflow-hidden shadow-xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative">
                <ImageWithFallback
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Progress indicator */}
                <div className="absolute bottom-4 right-4">
                  {course.progress === 100 ? (
                    <Badge className="bg-green-600 text-white border-0 shadow-lg">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Completed
                    </Badge>
                  ) : (
                    <Badge className="bg-blue-600 text-white border-0 shadow-lg">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {course.progress}% Complete
                    </Badge>
                  )}
                </div>

                {/* Level Badge */}
                <div className="absolute top-4 left-4">
                  <Badge className={`${getLevelColor(course.level)} border font-medium shadow-lg`}>
                    {course.level}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {course.description}
                    </p>
                  </div>

                  {/* Course Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {course.completedLessons}/{course.totalLessons} lessons
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {formatDate(course.lastWatched)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-medium text-blue-600">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                  
                  {/* Action Button */}
                  <Button
                    onClick={() => onCourseSelect(course.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {course.progress === 0 ? 'Start Learning' : 'Continue Learning'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty state */}
        {enrolledCourseDetails.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No enrolled courses yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start your learning journey by enrolling in some courses! Explore our catalog and find the perfect course for you.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 h-12 shadow-lg">
              <Target className="w-5 h-5 mr-2" />
              Browse Courses
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}