"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Users, Clock, BookOpen } from "lucide-react";

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string | null;
  level: string;
  price: number;
  instructor: {
    id: string;
    name: string;
    image: string | null;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  averageRating: number;
  totalStudents: number;
  totalLessons: number;
  totalReviews: number;
}

interface CourseGridProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export function CourseGrid({ searchParams }: CourseGridProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        
        // Add search parameters to API call
        if (searchParams.search) {
          params.append("search", searchParams.search as string);
        }
        if (searchParams.category) {
          params.append("category", searchParams.category as string);
        }
        if (searchParams.level) {
          params.append("level", searchParams.level as string);
        }
        if (searchParams.page) {
          params.append("page", searchParams.page as string);
        }

        const response = await fetch(`/api/courses?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        const data = await response.json();
        setCourses(data.courses);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [searchParams]);

  if (loading) {
    return <CourseGridSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Failed to load courses: {error}
        </p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          No courses found matching your criteria
        </p>
        <Button asChild>
          <Link href="/courses">Reset Filters</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={course.image || "/placeholder-course.jpg"}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge variant={course.level === "BEGINNER" ? "default" : course.level === "INTERMEDIATE" ? "secondary" : "destructive"}>
            {course.level}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className="bg-white/90 text-gray-900">
            {course.price === 0 ? "Free" : `$${course.price}`}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="mb-2">
          <Badge variant="outline" className="text-xs">
            {course.category.name}
          </Badge>
        </div>
        
        <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
          {course.description}
        </p>

        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{course.totalLessons} lessons</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{course.totalStudents} students</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">
              {course.averageRating > 0 ? course.averageRating.toFixed(1) : "New"}
            </span>
            {course.totalReviews > 0 && (
              <span className="text-xs text-gray-500">
                ({course.totalReviews} reviews)
              </span>
            )}
          </div>
          <p className="text-xs text-gray-600">
            by {course.instructor.name}
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full">
          <Link href={`/courses/${course.slug}`}>
            View Course
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function CourseGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-video w-full" />
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          </CardContent>
          <CardFooter className="p-6 pt-0">
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}