import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  Star,
  Users
} from "lucide-react";

// Type for serialized enrollment data
type SerializedEnrollment = {
  id: string;
  enrolledAt: string;
  completedAt: string | null;
  progress: number;
  currentLesson: string | null;
  userId: string;
  courseId: string;
  course: {
    id: string;
    title: string;
    slug: string;
    image: string | null;
    level: string;
    duration: number | null;
    instructor: {
      name: string | null;
    };
    _count: {
      lessons: number;
    };
    reviews: {
      rating: number;
    }[];
  };
  lessonProgress: {
    id: string;
    isCompleted: boolean;
    watchProgress: number;
    timeSpent: number;
    lastWatched: string | null;
    lessonId: string;
    enrollmentId: string;
  }[];
};

export default async function MyCoursesPage() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Get user enrollments
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: userId },
    include: {
      course: {
        include: {
          instructor: { select: { name: true } },
          _count: { select: { lessons: true } },
          reviews: { select: { rating: true } },
        },
      },
      lessonProgress: true,
    },
    orderBy: { enrolledAt: "desc" },
  });

  // Serialize data for client components
  const serializedEnrollments: SerializedEnrollment[] = JSON.parse(JSON.stringify(enrollments, (key, value) => {
    // Convert Decimal objects to numbers
    if (value && typeof value === 'object' && value.constructor && value.constructor.name === 'Decimal') {
      return Number(value);
    }
    return value;
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Courses
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Continue your learning journey
        </p>
      </div>

      {serializedEnrollments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {serializedEnrollments.map((enrollment: SerializedEnrollment) => {
            const averageRating = enrollment.course.reviews.length > 0
              ? enrollment.course.reviews.reduce((sum, review) => sum + review.rating, 0) / enrollment.course.reviews.length
              : 0;

            return (
              <Card key={enrollment.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-white" />
                </div>
                
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-tight mb-2">
                        {enrollment.course.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        by {enrollment.course.instructor.name}
                      </p>
                    </div>
                    <Badge 
                      variant={enrollment.progress === 100 ? "default" : "secondary"}
                      className="ml-2"
                    >
                      {enrollment.progress === 100 ? "Completed" : "In Progress"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round(enrollment.progress)}%</span>
                    </div>
                    <Progress value={enrollment.progress} className="h-2" />
                  </div>

                  {/* Course Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4" />
                      <span>{enrollment.course._count.lessons} lessons</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{averageRating > 0 ? averageRating.toFixed(1) : "N/A"}</span>
                    </div>
                  </div>

                  {/* Enrollment Date */}
                  <p className="text-xs text-gray-500">
                    Enrolled on {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button asChild className="flex-1">
                      <Link href={`/courses/${enrollment.course.slug}`}>
                        <Play className="w-4 h-4 mr-2" />
                        Continue
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`/courses/${enrollment.course.slug}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No courses enrolled yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start your learning journey by enrolling in a course
            </p>
            <Button asChild>
              <Link href="/courses">
                Browse Courses
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}