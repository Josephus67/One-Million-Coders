"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Star, Clock, Users, BookOpen, ArrowRight, AlertCircle, TrendingUp, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface RecommendedCourse {
  id: string;
  title: string;
  description: string;
  slug: string;
  image: string | null;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  price: number;
  duration: string | null;
  averageRating: number;
  totalReviews: number;
  recommendationReason: string;
  recommendationScore: number;
  instructor: {
    name: string | null;
    image: string | null;
  };
  category: {
    name: string;
  };
  _count: {
    enrollments: number;
    reviews: number;
  };
}

interface RecommendationsResponse {
  recommendations: RecommendedCourse[];
  metadata: {
    userLevel: string;
    preferredCategories: number;
    totalEnrolled: number;
    totalCompleted: number;
  };
}

export function CourseRecommendationsEnhanced() {
  const { user, isSignedIn } = useUser();
  const [recommendations, setRecommendations] = useState<RecommendedCourse[]>([]);
  const [metadata, setMetadata] = useState<RecommendationsResponse["metadata"] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isSignedIn && user?.id) {
      fetchRecommendations();
    }
  }, [isSignedIn, user]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/recommendations?limit=6");
      
      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const data: RecommendationsResponse = await response.json();
      setRecommendations(data.recommendations);
      setMetadata(data.metadata);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case "BEGINNER":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "INTERMEDIATE":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "ADVANCED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getRecommendationIcon = (reason: string) => {
    if (reason.includes("Trending")) {
      return <TrendingUp className="w-4 h-4 text-orange-500" />;
    } else if (reason.includes("Popular")) {
      return <Users className="w-4 h-4 text-blue-500" />;
    } else if (reason.includes("Highly rated")) {
      return <Star className="w-4 h-4 text-yellow-500" />;
    } else if (reason.includes("New")) {
      return <Sparkles className="w-4 h-4 text-purple-500" />;
    }
    return <BookOpen className="w-4 h-4 text-gray-500" />;
  };

  const formatPrice = (price: number) => {
    return price === 0 ? "Free" : `$${price.toFixed(2)}`;
  };

  if (!isSignedIn) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Sign in for Personalized Recommendations
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Get course recommendations tailored to your learning progress and interests.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with user insights */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Recommended for You
          </h2>
          {metadata && (
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Based on your {metadata.totalEnrolled} enrolled courses and {metadata.userLevel.toLowerCase()} level
            </p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchRecommendations}
          disabled={loading}
        >
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="relative">
                <Skeleton className="w-full h-48" />
              </div>
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : recommendations.length > 0 ? (
          recommendations.map((course) => (
            <Card
              key={course.id}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-200 group"
            >
              <div className="relative">
                <Image
                  src={course.image || "/api/placeholder/400/200"}
                  alt={course.title}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                />
                
                {/* Recommendation badge */}
                <div className="absolute top-3 left-3">
                  <div className="flex items-center space-x-1 bg-white/90 dark:bg-gray-900/90 rounded-full px-2 py-1 text-xs">
                    {getRecommendationIcon(course.recommendationReason)}
                    <span className="font-medium">{course.recommendationReason}</span>
                  </div>
                </div>

                {/* Level badge */}
                <div className="absolute top-3 right-3">
                  <Badge className={getLevelBadgeColor(course.level)}>
                    {course.level}
                  </Badge>
                </div>

                {/* Price */}
                <div className="absolute bottom-3 right-3">
                  <div className="bg-white dark:bg-gray-900 rounded-lg px-2 py-1 shadow">
                    <span className="font-bold text-green-600 dark:text-green-400">
                      {formatPrice(course.price)}
                    </span>
                  </div>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                      {course.description}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration || "Self-paced"}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{course._count.enrollments}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">
                          {course.averageRating > 0 ? course.averageRating.toFixed(1) : "New"}
                        </span>
                      </div>
                      {course.totalReviews > 0 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ({course.totalReviews})
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {course.category.name}
                    </p>
                  </div>

                  <div className="pt-2">
                    <Link href={`/courses/${course.slug}`} passHref>
                      <Button className="w-full group">
                        View Course
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Recommendations Available
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Enroll in a few courses to get personalized recommendations.
            </p>
          </div>
        )}
      </div>

      {recommendations.length > 0 && (
        <div className="text-center">
          <Link href="/courses" passHref>
            <Button variant="outline">
              Browse All Courses
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}