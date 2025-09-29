import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { CourseHeader } from "@/components/course/course-header";
import { CourseCurriculum } from "@/components/course/course-curriculum";
import { CourseEnrollment } from "@/components/course/course-enrollment";
import { CourseReviews } from "@/components/course/course-reviews";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CoursePageProps {
  params: {
    slug: string;
  };
}

// Utility function to convert Decimal objects to numbers for client components
function serializeCourse(course: any) {
  return {
    ...course,
    price: course.price ? Number(course.price) : 0,
    averageRating: course.averageRating ? Number(course.averageRating) : 0,
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { userId } = await auth() || {};

  const course = await prisma.course.findUnique({
      where: { slug: params.slug },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            image: true,
            bio: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        lessons: {
          where: { isPublished: true },
          orderBy: { order: "asc" },
          select: {
            id: true,
            title: true,
            description: true,
            duration: true,
            order: true,
            isPublished: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: {
          select: {
            enrollments: true,
            reviews: true,
          },
        },
      },
    });

  if (!course) {
    notFound();
  }

  if (course.status !== "PUBLISHED") {
    notFound();
  }

  // Check if user is enrolled
  let enrollment = null;
  if (userId) {
    try {
      enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: userId,
            courseId: course.id,
          },
        },
        include: {
          lessonProgress: true,
        },
      });
    } catch (error) {
      console.error("Error checking enrollment:", error);
      // Continue without enrollment data
    }
  }

  // Calculate average rating
  const averageRating = course.reviews.length > 0
    ? course.reviews.reduce((sum, review) => sum + review.rating, 0) / course.reviews.length
    : 0;

  // Serialize course data for client components
  const serializedCourse = serializeCourse(course);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <CourseHeader 
        course={serializedCourse}
        averageRating={averageRating}
        totalStudents={course._count.enrollments}
        totalReviews={course._count.reviews}
        isEnrolled={!!enrollment}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <h3>About this course</h3>
                  <p>{serializedCourse.description}</p>
                  
                  <h3>What you'll learn</h3>
                  <ul>
                    <li>Master the fundamentals of {serializedCourse.title.toLowerCase()}</li>
                    <li>Build practical projects to reinforce your learning</li>
                    <li>Develop problem-solving skills in this domain</li>
                    <li>Prepare for real-world applications</li>
                  </ul>

                  <h3>About the instructor</h3>
                  <div className="flex items-start space-x-4 not-prose">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {serializedCourse.instructor.name?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{serializedCourse.instructor.name}</h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {serializedCourse.instructor.bio || "Experienced instructor dedicated to helping students succeed."}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="curriculum" className="mt-6">
                <CourseCurriculum 
                  lessons={serializedCourse.lessons}
                  enrollment={enrollment}
                  isEnrolled={!!enrollment}
                />
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                <CourseReviews 
                  reviews={serializedCourse.reviews}
                  averageRating={averageRating}
                  totalReviews={serializedCourse._count.reviews}
                  courseId={serializedCourse.id}
                  canReview={!!enrollment && !!userId}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <CourseEnrollment 
              course={serializedCourse}
              enrollment={enrollment}
              isAuthenticated={!!userId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}