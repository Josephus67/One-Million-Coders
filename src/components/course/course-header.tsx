import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Clock, BookOpen } from "lucide-react";

interface CourseHeaderProps {
  course: {
    id: string;
    title: string;
    description: string;
    image: string | null;
    level: string;
    duration: string | null;
    instructor: {
      name: string | null;
      image: string | null;
    };
    category: {
      name: string;
    };
    lessons: any[];
  };
  averageRating: number;
  totalStudents: number;
  totalReviews: number;
  isEnrolled: boolean;
}

export function CourseHeader({
  course,
  averageRating,
  totalStudents,
  totalReviews,
  isEnrolled,
}: CourseHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="mb-4">
              <Badge variant="secondary" className="mb-2">
                {course.category.name}
              </Badge>
              {isEnrolled && (
                <Badge variant="outline" className="ml-2 border-white text-white">
                  Enrolled
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            
            <p className="text-lg text-blue-100 mb-6 line-clamp-3">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-medium">
                  {averageRating > 0 ? averageRating.toFixed(1) : "New"}
                </span>
                {totalReviews > 0 && (
                  <span className="text-blue-200">
                    ({totalReviews} reviews)
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{totalStudents} students</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <BookOpen className="w-4 h-4" />
                <span>{course.lessons.length} lessons</span>
              </div>
              
              {course.duration && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
              )}
              
              <Badge 
                variant="outline" 
                className="border-white text-white"
              >
                {course.level}
              </Badge>
            </div>

            <div className="flex items-center space-x-3 mt-6">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="font-semibold">
                  {course.instructor.name?.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm text-blue-200">Instructor</p>
                <p className="font-medium">{course.instructor.name}</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-video rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={course.image || "/placeholder-course.jpg"}
                alt={course.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}