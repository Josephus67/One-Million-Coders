import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  Trophy,
  TrendingUp,
  Users,
  Star,
  Play,
  ChevronRight,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  // Get user enrollments and progress
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
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

  // Get recent courses
  const recentCourses = await prisma.course.findMany({
    where: { status: "PUBLISHED" },
    include: {
      instructor: { select: { name: true } },
      _count: { select: { enrollments: true, lessons: true } },
      reviews: { select: { rating: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const stats = {
    totalCourses: enrollments.length,
    completedCourses: enrollments.filter(e => e.progress === 100).length,
    totalHours: Math.round(
      enrollments.reduce((acc, enrollment) => {
        return acc + enrollment.lessonProgress.reduce((total, progress) => {
          return total + progress.timeSpent;
        }, 0);
      }, 0) / 3600
    ),
    certificates: enrollments.filter(e => e.completedAt).length,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {session.user.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Continue your learning journey and track your progress.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              Active learning paths
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedCourses}</div>
            <p className="text-xs text-muted-foreground">
              Courses finished
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHours}h</div>
            <p className="text-xs text-muted-foreground">
              Total learning time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.certificates}</div>
            <p className="text-xs text-muted-foreground">
              Achievements earned
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Continue Learning */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Continue Learning</CardTitle>
                  <CardDescription>
                    Pick up where you left off
                  </CardDescription>
                </div>
                <Link href="/my-courses">
                  <Button variant="outline" size="sm">
                    View All
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {enrollments.length > 0 ? (
                enrollments.slice(0, 3).map((enrollment) => {
                  const averageRating = enrollment.course.reviews.length > 0
                    ? enrollment.course.reviews.reduce((sum, review) => sum + review.rating, 0) / enrollment.course.reviews.length
                    : 0;

                  return (
                    <div
                      key={enrollment.id}
                      className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {enrollment.course.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          by {enrollment.course.instructor.name}
                        </p>
                        <div className="mt-2">
                          <Progress value={enrollment.progress} className="h-2" />
                          <p className="text-xs text-gray-500 mt-1">
                            {Math.round(enrollment.progress)}% complete
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm">
                            {averageRating > 0 ? averageRating.toFixed(1) : "N/A"}
                          </span>
                        </div>
                        <Link href={`/courses/${enrollment.course.slug}`}>
                          <Button size="sm">
                            <Play className="w-4 h-4 mr-2" />
                            Continue
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    No enrolled courses yet
                  </p>
                  <Link href="/courses">
                    <Button>
                      Browse Courses
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recommended Courses */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recommended for You</CardTitle>
              <CardDescription>
                Popular courses you might enjoy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentCourses.slice(0, 3).map((course) => {
                const averageRating = course.reviews.length > 0
                  ? course.reviews.reduce((sum, review) => sum + review.rating, 0) / course.reviews.length
                  : 0;

                return (
                  <div
                    key={course.id}
                    className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                          {course.title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          by {course.instructor.name}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              {course.level}
                            </Badge>
                            {averageRating > 0 && (
                              <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                <span className="text-xs">{averageRating.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Users className="w-3 h-3" />
                            <span>{course._count.enrollments}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Link href={`/courses/${course.slug}`}>
                      <Button variant="outline" size="sm" className="w-full mt-3">
                        View Course
                      </Button>
                    </Link>
                  </div>
                );
              })}
              <Link href="/courses">
                <Button variant="outline" className="w-full">
                  Browse All Courses
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}