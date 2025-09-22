import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlayCircle, Lock, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import { Lesson } from "@/types/course";

interface LessonProgress {
  id: string;
  isCompleted: boolean;
  watchProgress: number;
  lessonId: string;
}

interface CourseCurriculumProps {
  lessons: Lesson[];
  enrollment: {
    lessonProgress: LessonProgress[];
  } | null;
  isEnrolled: boolean;
}

export function CourseCurriculum({ lessons, enrollment, isEnrolled }: CourseCurriculumProps) {
  const formatDuration = (duration: string | null | undefined) => {
    if (!duration) return "N/A";
    // If it's already formatted (like "10:30"), return as-is
    if (duration.includes(":")) return duration;
    // If it's a number string, convert to minutes:seconds format
    const seconds = parseInt(duration);
    if (isNaN(seconds)) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getLessonProgress = (lessonId: string) => {
    return enrollment?.lessonProgress.find(p => p.lessonId === lessonId);
  };

  const completedLessons = enrollment?.lessonProgress.filter(p => p.isCompleted).length || 0;
  const totalLessons = lessons.length;
  const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Course Curriculum</CardTitle>
          {isEnrolled && (
            <Badge variant="outline">
              {completedLessons} of {totalLessons} completed
            </Badge>
          )}
        </div>
        {isEnrolled && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {lessons.map((lesson) => {
          const progress = getLessonProgress(lesson.id);
          const isCompleted = progress?.isCompleted || false;
          const watchProgress = progress?.watchProgress || 0;

          return (
            <div
              key={lesson.id}
              className={`flex items-center space-x-4 p-4 border rounded-lg transition-colors ${
                isEnrolled ? "hover:bg-gray-50 dark:hover:bg-gray-800" : ""
              }`}
            >
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : isEnrolled ? (
                  <PlayCircle className="w-6 h-6 text-blue-500" />
                ) : (
                  <Lock className="w-6 h-6 text-gray-400" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-900 dark:text-white truncate">
                    {lesson.order}. {lesson.title}
                  </h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(lesson.duration)}</span>
                  </div>
                </div>
                
                {lesson.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {lesson.description}
                  </p>
                )}
                
                {isEnrolled && watchProgress > 0 && !isCompleted && (
                  <div className="mt-2">
                    <Progress value={watchProgress} className="h-1" />
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round(watchProgress)}% watched
                    </p>
                  </div>
                )}
              </div>
              
              {isEnrolled && (
                <Button asChild size="sm" variant="outline">
                  <Link href={`/learn/${lesson.id}`}>
                    {isCompleted ? "Review" : "Watch"}
                  </Link>
                </Button>
              )}
            </div>
          );
        })}
        
        {lessons.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No lessons available yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}