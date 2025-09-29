import { Suspense } from "react";
import { CourseGrid } from "@/components/course-grid";
import { CourseFilters } from "@/components/course-filters";
import { SearchBar } from "@/components/search-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Browse Courses
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Discover and enroll in courses to expand your knowledge
        </p>
        
        <SearchBar />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-80 flex-shrink-0">
          <CourseFilters />
        </aside>

        <main className="flex-1">
          <Suspense fallback={<CourseGridSkeleton />}>
            <CourseGrid searchParams={searchParams} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

function CourseGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}