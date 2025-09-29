"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { VideoPlayer } from './VideoPlayer';
import { 
  ArrowLeft, 
  Play, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  User,
  Star,
  ChevronRight,
  Download,
  Share,
  AlertTriangle
} from 'lucide-react';
import { Course, Lesson, UserProgress } from '../types/course';

interface CourseLearningPageProps {
  course: Course;
  userProgress?: UserProgress;
  onBack: () => void;
  onLessonComplete: (lessonId: string, timeSpent?: number) => void;
  onProgress: (lessonId: string, progress: number, timeSpent?: number) => void;
}

export function CourseLearningPage({ 
  course, 
  userProgress,
  onBack, 
  onLessonComplete, 
  onProgress 
}: CourseLearningPageProps) {
  // Find current lesson based on user progress or default to first lesson
  const initialLesson = userProgress?.currentLesson 
    ? course.lessons?.find(l => l.id === userProgress.currentLesson) || course.lessons?.[0]
    : course.lessons?.[0];
    
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(initialLesson || null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sessionStartTime, setSessionStartTime] = useState<Date>(new Date());
  const [lessonStartTime, setLessonStartTime] = useState<Date>(new Date());
  const timeSpentRef = useRef<number>(0);

  // Reset lesson start time when lesson changes
  useEffect(() => {
    if (currentLesson) {
      setLessonStartTime(new Date());
      timeSpentRef.current = 0;
    }
  }, [currentLesson?.id]);

  // Track time spent every 30 seconds
  useEffect(() => {
    if (!currentLesson) return;
    
    const interval = setInterval(() => {
      const now = new Date();
      const sessionTime = Math.floor((now.getTime() - lessonStartTime.getTime()) / 1000 / 60); // Minutes
      
      if (sessionTime > 0 && currentLesson) {
        timeSpentRef.current = sessionTime;
        // Update progress every 30 seconds with time tracking
        onProgress(currentLesson.id, 0, 0.5); // 0.5 minutes for this interval
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [currentLesson?.id, lessonStartTime, onProgress]);

  // Check if course has lessons
  if (!course.lessons || course.lessons.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <CardTitle className="text-xl font-semibold">Course Content Coming Soon</CardTitle>
            <CardDescription>
              This course is being prepared with exciting content. We're adding high-quality lessons with video tutorials. Check back soon!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm">
              <p className="text-blue-700 dark:text-blue-300 mb-2">
                <strong>What to expect:</strong>
              </p>
              <ul className="text-blue-600 dark:text-blue-400 space-y-1">
                <li>• Interactive video lessons</li>
                <li>• Hands-on coding exercises</li>
                <li>• Real-world projects</li>
                <li>• Certificate upon completion</li>
              </ul>
            </div>
            <Button onClick={onBack} className="w-full">
              Back to Course
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Ensure we have a current lesson, fallback to first lesson
  if (!currentLesson && course.lessons.length > 0) {
    setCurrentLesson(course.lessons[0]);
  }

  // If still no current lesson, show loading state
  if (!currentLesson) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
              <Play className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-xl font-semibold">Loading Lesson...</CardTitle>
            <CardDescription>
              Preparing your learning experience. Please wait a moment.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    
    if (hrs > 0) {
      return `${hrs}h ${remainingMins}m`;
    }
    return `${mins}m`;
  };

  const handleLessonSelect = (lesson: Lesson) => {
    // Calculate and send time spent on current lesson
    if (currentLesson) {
      const timeSpent = Math.floor((new Date().getTime() - lessonStartTime.getTime()) / 1000 / 60);
      if (timeSpent > 0) {
        onProgress(currentLesson.id, 0, timeSpent);
      }
    }
    
    setCurrentLesson(lesson);
  };

  const handleLessonComplete = (lessonId: string) => {
    // Calculate time spent on this lesson
    const timeSpent = Math.floor((new Date().getTime() - lessonStartTime.getTime()) / 1000 / 60);
    onLessonComplete(lessonId, timeSpent > 0 ? timeSpent : 1); // Minimum 1 minute
    
    // Auto-advance to next lesson
    const currentIndex = course.lessons.findIndex(l => l.id === lessonId);
    if (currentIndex < course.lessons.length - 1) {
      const nextLesson = course.lessons[currentIndex + 1];
      setTimeout(() => {
        setCurrentLesson(nextLesson);
      }, 2000); // Wait 2 seconds before advancing
    }
  };

  const handleProgress = (progress: number) => {
    // Send minimal time update (this gets called frequently during video watching)
    if (currentLesson) {
      onProgress(currentLesson.id, progress);
    }
  };

  const completedLessons = course.lessons.filter(l => l.isCompleted).length;
  const courseProgress = (completedLessons / course.lessons.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={onBack}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Course</span>
              </Button>
              
              <div className="hidden md:block">
                <h1 className="text-xl font-semibold text-gray-900">{course.title}</h1>
                <p className="text-sm text-gray-600">by {typeof course.instructor === 'string' ? course.instructor : course.instructor?.name || 'Unknown Instructor'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {completedLessons} of {course.lessons.length} lessons
                </p>
                <p className="text-xs text-gray-600">
                  {Math.round(courseProgress)}% complete
                </p>
              </div>
              <Progress value={courseProgress} className="w-32 hidden lg:block" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Lessons Sidebar */}
        <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-white border-r border-gray-200 overflow-hidden sticky top-[80px] h-[calc(100vh-80px)]`}>
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900">Course Content</h2>
              <Button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                variant="ghost"
                size="sm"
              >
                <ChevronRight className={`w-4 h-4 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
              </Button>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>{course.lessons.length} lessons</span>
                <span>{formatDuration(course.lessons.reduce((acc, l) => {
                  const seconds = typeof l.duration === 'string' 
                    ? parseInt(l.duration) || 0 
                    : l.duration || 0;
                  return acc + seconds;
                }, 0))}</span>
              </div>
              <Progress value={courseProgress} className="h-2" />
              <div className="text-xs">
                {completedLessons} completed • {course.lessons.length - completedLessons} remaining
              </div>
            </div>
          </div>
          
          <ScrollArea className="h-[calc(100vh-260px)]">
            <div className="p-2">
              {course.lessons.map((lesson, index) => (
                <Card
                  key={lesson.id}
                  className={`mb-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    currentLesson!.id === lesson.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleLessonSelect(lesson)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {lesson.isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : currentLesson?.id === lesson.id ? (
                          <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                            <Play className="w-3 h-3 text-white fill-current" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-500">{index + 1}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-sm font-medium truncate ${
                          currentLesson?.id === lesson.id ? 'text-blue-700' : 'text-gray-900'
                        }`}>
                          {lesson.title}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {lesson.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatDuration(typeof lesson.duration === 'string' 
                              ? parseInt(lesson.duration) || 0 
                              : lesson.duration || 0)}
                          </div>
                          {(lesson.watchProgress || 0) > 0 && !lesson.isCompleted && (
                            <div className="text-xs text-blue-600 font-medium">
                              {lesson.watchProgress || 0}%
                            </div>
                          )}
                        </div>
                        {(lesson.watchProgress || 0) > 0 && !lesson.isCompleted && (
                          <Progress value={lesson.watchProgress || 0} className="h-1 mt-2" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-0">
          {/* Toggle Sidebar Button (when closed) */}
          {!sidebarOpen && (
            <Button
              onClick={() => setSidebarOpen(true)}
              variant="outline"
              size="sm"
              className="fixed top-24 left-4 z-30 shadow-lg"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Lessons
            </Button>
          )}

          {/* Video Player */}
          <div className="p-6">
            <div className="max-w-5xl mx-auto">
              <VideoPlayer
                lesson={currentLesson}
                onProgress={handleProgress}
                onComplete={() => handleLessonComplete(currentLesson.id)}
                autoPlay={false}
                className="mb-6"
              />
              
              {/* Lesson Details */}
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{currentLesson.title}</CardTitle>
                      <p className="text-gray-600 leading-relaxed">{currentLesson.description}</p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Resources
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <Separator className="my-4" />
                  
                  {/* Course Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{typeof course.instructor === 'string' ? course.instructor : course.instructor?.name || 'Unknown Instructor'}</p>
                        <p className="text-xs text-gray-600">Instructor</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{course.rating} Rating</p>
                        <p className="text-xs text-gray-600">{course.students?.toLocaleString() || 0} students</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{course.level} Level</p>
                        <p className="text-xs text-gray-600">
                          {typeof course.category === 'string' 
                            ? course.category 
                            : (course.category as any)?.name || 'Uncategorized'
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Navigation */}
                  <Separator className="my-6" />
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const currentIndex = course.lessons.findIndex(l => l.id === currentLesson!.id);
                        if (currentIndex > 0) {
                          setCurrentLesson(course.lessons[currentIndex - 1]);
                        }
                      }}
                      disabled={course.lessons.findIndex(l => l.id === currentLesson!.id) === 0}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous Lesson
                    </Button>
                    
                    <Button
                      onClick={() => {
                        const currentIndex = course.lessons.findIndex(l => l.id === currentLesson!.id);
                        if (currentIndex < course.lessons.length - 1) {
                          setCurrentLesson(course.lessons[currentIndex + 1]);
                        }
                      }}
                      disabled={course.lessons.findIndex(l => l.id === currentLesson!.id) === course.lessons.length - 1}
                    >
                      Next Lesson
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}