import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getCourseById } from '../data/mockCourses';
import { 
  ArrowLeft, 
  Play, 
  Clock, 
  BookOpen, 
  CheckCircle, 
  Users, 
  Star,
  Award,
  Target
} from 'lucide-react';

interface CourseDetailProps {
  courseId: string;
  isEnrolled: boolean;
  onEnroll: () => void;
  onStartLearning: () => void;
  onBack: () => void;
}

export function CourseDetail({ courseId, isEnrolled, onEnroll, onStartLearning, onBack }: CourseDetailProps) {
  const course = getCourseById(courseId);

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-gray-600 mb-4">Course not found</h2>
          <Button onClick={onBack} className="bg-blue-500 hover:bg-blue-600 text-white">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const formatDuration = (duration: string | number | null | undefined) => {
    let seconds: number;
    
    if (typeof duration === 'string') {
      seconds = parseDurationToSeconds(duration);
    } else if (typeof duration === 'number') {
      seconds = duration;
    } else {
      return 'N/A';
    }
    
    const mins = Math.floor(seconds / 60);
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    
    if (hrs > 0) {
      return `${hrs}h ${remainingMins}m`;
    }
    return `${mins}m`;
  };

  const parseDurationToSeconds = (duration: string | null | undefined): number => {
    if (!duration) return 0;
    // If it's already in MM:SS format
    if (duration.includes(':')) {
      const [mins, secs] = duration.split(':').map(Number);
      return (mins * 60) + (secs || 0);
    }
    // If it's a number string (seconds)
    const seconds = parseInt(duration);
    return isNaN(seconds) ? 0 : seconds;
  };

  const totalDuration = course.lessons.reduce((acc, lesson) => {
    return acc + parseDurationToSeconds(lesson.duration);
  }, 0);

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
        {/* Back Button */}
        <Button
          onClick={onBack}
          variant="outline"
          className="flex items-center space-x-2 mb-8 hover:bg-blue-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Courses</span>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge className={`${getLevelColor(course.level)} border font-medium`}>
                        {course.level}
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        {typeof course.category === 'string' 
                          ? course.category 
                          : (course.category as any)?.name || 'Uncategorized'
                        }
                      </Badge>
                    </div>
                    
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                      {course.title}
                    </h1>
                    
                    <p className="text-lg text-gray-600 leading-relaxed mb-6">
                      {course.description}
                    </p>

                    {/* Course Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-600">{formatDuration(totalDuration)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-600">{course.lessons.length} lessons</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-600">{course.students?.toLocaleString() || 0} students</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{course.rating} rating</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4">
                      {isEnrolled ? (
                        <>
                          <Button
                            onClick={onStartLearning}
                            className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-6"
                          >
                            <Play className="w-5 h-5 mr-2" />
                            Continue Learning
                          </Button>
                          <Badge className="bg-green-600 text-white border-0 px-4 py-2 h-12 flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Enrolled
                          </Badge>
                        </>
                      ) : (
                        <Button
                          onClick={onEnroll}
                          className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8"
                        >
                          <BookOpen className="w-5 h-5 mr-2" />
                          Enroll Now - {course.price}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Course Image */}
                  <div className="lg:w-80">
                    <ImageWithFallback
                      src={course.image}
                      alt={course.title}
                      className="w-full h-64 lg:h-80 object-cover rounded-xl shadow-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Curriculum */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  Course Curriculum
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {course.lessons.map((lesson, index) => (
                    <div key={lesson.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                          <p className="text-sm text-gray-600 line-clamp-1">{lesson.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {formatDuration(lesson.duration)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Instructor Info */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  Instructor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-3">
                    <Users className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{typeof course.instructor === 'string' ? course.instructor : course.instructor?.name || 'Unknown Instructor'}</h3>
                  <p className="text-sm text-gray-600">Senior Instructor</p>
                </div>
              </CardContent>
            </Card>

            {/* Course Features */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-600" />
                  Course Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">Video lessons</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">Progress tracking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">Certificate of completion</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">Lifetime access</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">Mobile friendly</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Tags */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-orange-600" />
                  Skills You'll Learn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}