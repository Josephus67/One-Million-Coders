"use client";

"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  PlayCircle, 
  Clock, 
  BookOpen, 
  Star, 
  Users, 
  CheckCircle2,
  AlertCircle 
} from "lucide-react";

interface CourseEnrollmentProps {
  course: {
    id: string;
    title: string;
    price: number;
    level: string;
    lessons: any[];
  };
  enrollment: {
    id: string;
    progress: number;
    enrolledAt: Date;
    lessonProgress: any[];
  } | null;
  isAuthenticated: boolean;
}

export function CourseEnrollment({ course, enrollment, isAuthenticated }: CourseEnrollmentProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    setIsEnrolling(true);
    setError(null);

    try {
      const response = await fetch("/api/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: course.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to enroll in course");
      }

      // Refresh the page to show updated enrollment status
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleContinueLearning = () => {
    if (enrollment?.lessonProgress && enrollment.lessonProgress.length > 0) {
      // Find the first incomplete lesson
      const incompleteLessons = course.lessons.filter(lesson => 
        !enrollment.lessonProgress.some(p => p.lessonId === lesson.id && p.isCompleted)
      );
      
      if (incompleteLessons.length > 0) {
        router.push(`/learn/${incompleteLessons[0].id}`);
      } else {
        // All lessons completed, go to first lesson for review
        router.push(`/learn/${course.lessons[0]?.id}`);
      }
    } else {
      // No progress yet, start with first lesson
      router.push(`/learn/${course.lessons[0]?.id}`);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Course Access</span>
            <Badge variant={course.price === 0 ? "secondary" : "default"}>
              {course.price === 0 ? "Free" : `$${course.price}`}
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {enrollment ? (
            <div className="space-y-4">
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  You are enrolled in this course!
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(enrollment.progress)}%</span>
                </div>
                <Progress value={enrollment.progress} />
                <p className="text-xs text-gray-500">
                  Enrolled on {new Date(enrollment.enrolledAt).toLocaleDateString()}
                </p>
              </div>

              <Button 
                onClick={handleContinueLearning} 
                className="w-full" 
                size="lg"
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                {enrollment.progress > 0 ? "Continue Learning" : "Start Learning"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Button
                onClick={handleEnroll}
                disabled={isEnrolling}
                className="w-full"
                size="lg"
              >
                {isEnrolling ? (
                  "Enrolling..."
                ) : course.price === 0 ? (
                  "Enroll for Free"
                ) : (
                  `Enroll - $${course.price}`
                )}
              </Button>

              {!isAuthenticated && (
                <p className="text-sm text-gray-600 text-center">
                  <Button 
                    variant="link" 
                    onClick={() => router.push("/auth/login")}
                    className="p-0 h-auto"
                  >
                    Sign in
                  </Button>
                  {" "}or{" "}
                  <Button 
                    variant="link" 
                    onClick={() => router.push("/auth/register")}
                    className="p-0 h-auto"
                  >
                    create an account
                  </Button>
                  {" "}to enroll
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Course Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Course Information</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Lessons</span>
              </div>
              <span className="text-sm font-medium">{course.lessons.length}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Level</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {course.level}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Access</span>
              </div>
              <span className="text-sm">Lifetime</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Certificate</span>
              </div>
              <span className="text-sm">On completion</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}