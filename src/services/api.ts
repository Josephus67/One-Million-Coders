export interface ApiCourse {
  id: string;
  title: string;
  description: string;
  slug: string;
  image: string | null;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  price: number;
  duration: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
  instructor: {
    id: string;
    name: string | null;
    image: string | null;
    bio?: string | null;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  totalStudents: number;
  totalLessons: number;
  lessons?: ApiLesson[];
  reviews?: ApiReview[];
}

export interface ApiLesson {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  videoUrl: string | null;
  duration: string | null;
  order: number;
  isCompleted?: boolean;
  watchProgress?: number;
  isPublished?: boolean;
}

export interface ApiReview {
  rating: number;
  comment: string | null;
  user: {
    name: string | null;
    image: string | null;
  };
  createdAt: string;
}

export interface ApiCoursesResponse {
  courses: ApiCourse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FetchCoursesParams {
  category?: string;
  level?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export async function fetchCourses(params: FetchCoursesParams = {}): Promise<ApiCoursesResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.category) searchParams.set('category', params.category);
  if (params.level) searchParams.set('level', params.level);
  if (params.search) searchParams.set('search', params.search);
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());

  const response = await fetch(`/api/courses?${searchParams.toString()}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch courses: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchCourseById(id: string): Promise<ApiCourse> {
  const response = await fetch(`/api/courses/${id}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch course: ${response.statusText}`);
  }

  return response.json();
}

export function transformApiCourseToMockCourse(apiCourse: ApiCourse) {
  return {
    id: apiCourse.id,
    title: apiCourse.title,
    description: apiCourse.description,
    category: apiCourse.category.name,
    image: apiCourse.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500',
    duration: apiCourse.duration || '4 weeks',
    level: (apiCourse.level === 'BEGINNER' ? 'Beginner' : 
           apiCourse.level === 'INTERMEDIATE' ? 'Intermediate' : 'Advanced') as 'Beginner' | 'Intermediate' | 'Advanced',
    instructor: apiCourse.instructor.name || 'Ghana Tech Instructor',
    rating: apiCourse.averageRating || 0,
    students: apiCourse.totalStudents || 0,
    price: apiCourse.price === 0 ? 'Free' : `$${apiCourse.price}`,
    tags: [apiCourse.category.name, apiCourse.level.toLowerCase()],
    totalLessons: apiCourse.totalLessons || 0,
    completedLessons: 0,
    lessons: apiCourse.lessons ? apiCourse.lessons.map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      videoUrl: lesson.videoUrl,
      duration: lesson.duration, // Keep as string to match database schema
      order: lesson.order,
      isCompleted: lesson.isCompleted || false,
      watchProgress: lesson.watchProgress || 0,
      isPublished: lesson.isPublished || true
    })) : []
  };
}

function parseDurationToSeconds(duration: string): number {
  const match = duration.match(/(\d+)\s*(minutes?|hours?)/i);
  if (!match) return 0;
  
  const value = parseInt(match[1]);
  const unit = match[2].toLowerCase();
  
  if (unit.startsWith('hour')) {
    return value * 3600; // hours to seconds
  } else {
    return value * 60; // minutes to seconds
  }
}