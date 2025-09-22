"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Course Card Loading Skeleton
export function CourseCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <Skeleton className="w-full h-48" />
      </div>
      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-6 w-12" />
        </div>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}

// Course Grid Loading
export function CourseGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }, (_, index) => (
        <CourseCardSkeleton key={index} />
      ))}
    </div>
  );
}

// Dashboard Stats Loading
export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }, (_, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Course Detail Loading
export function CourseDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="relative h-96">
        <Skeleton className="w-full h-full" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-8 left-8 space-y-4">
          <Skeleton className="h-8 w-64 bg-white/20" />
          <Skeleton className="h-4 w-48 bg-white/20" />
          <div className="flex items-center space-x-4">
            <Skeleton className="h-6 w-16 bg-white/20" />
            <Skeleton className="h-6 w-20 bg-white/20" />
            <Skeleton className="h-6 w-24 bg-white/20" />
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// List Loading (for tables/lists)
export function ListSkeleton({ count = 5, showAvatar = false }: { count?: number; showAvatar?: boolean }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
          {showAvatar && <Skeleton className="h-10 w-10 rounded-full" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  );
}

// Page Loading Spinner
export function PageLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
        </div>
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-900 dark:text-white">{message}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Please wait while we load your content</p>
        </div>
      </div>
    </div>
  );
}

// Inline Loading Spinner
export function InlineLoading({ size = "sm", message }: { size?: "sm" | "md" | "lg"; message?: string }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <div className={`${sizeClasses[size]} border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin`}></div>
      {message && <span className="text-sm text-gray-500 dark:text-gray-400">{message}</span>}
    </div>
  );
}

// Form Loading State
export function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-32 w-full" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
  );
}

// Search Loading
export function SearchSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-20" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }, (_, index) => (
          <CourseCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}