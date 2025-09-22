"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";

const LEVELS = [
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
];

const CATEGORIES = [
  { value: "programming", label: "Programming" },
  { value: "web-development", label: "Web Development" },
  { value: "data-science", label: "Data Science" },
  { value: "design", label: "Design" },
  { value: "business", label: "Business" },
  { value: "marketing", label: "Marketing" },
];

export function CourseFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentLevel = searchParams.get("level");
  const currentCategory = searchParams.get("category");

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    params.delete("page"); // Reset page when filtering
    
    router.push(`/courses?${params.toString()}`);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    const search = searchParams.get("search");
    if (search) {
      params.set("search", search);
    }
    router.push(`/courses?${params.toString()}`);
  };

  const hasActiveFilters = currentLevel || currentCategory;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAllFilters}
              className="text-xs"
            >
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Active Filters */}
        {hasActiveFilters && (
          <div>
            <h4 className="text-sm font-medium mb-3">Active Filters</h4>
            <div className="flex flex-wrap gap-2">
              {currentLevel && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Level: {LEVELS.find(l => l.value === currentLevel)?.label}
                  <button
                    onClick={() => updateFilter("level", null)}
                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {currentCategory && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Category: {CATEGORIES.find(c => c.value === currentCategory)?.label}
                  <button
                    onClick={() => updateFilter("category", null)}
                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
            <Separator className="mt-4" />
          </div>
        )}

        {/* Level Filter */}
        <div>
          <h4 className="text-sm font-medium mb-3">Level</h4>
          <div className="space-y-2">
            {LEVELS.map((level) => (
              <Button
                key={level.value}
                variant={currentLevel === level.value ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start"
                onClick={() => updateFilter("level", 
                  currentLevel === level.value ? null : level.value
                )}
              >
                {level.label}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Category Filter */}
        <div>
          <h4 className="text-sm font-medium mb-3">Category</h4>
          <div className="space-y-2">
            {CATEGORIES.map((category) => (
              <Button
                key={category.value}
                variant={currentCategory === category.value ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start text-left"
                onClick={() => updateFilter("category", 
                  currentCategory === category.value ? null : category.value
                )}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}