export interface Lesson {
  id: string;
  title: string;
  description: string | null;
  content?: string | null; // Lesson content/text
  videoUrl?: string | null; // YouTube URL
  duration?: string | null; // Duration as string (e.g., "10:30")
  order: number;
  isCompleted?: boolean;
  watchProgress?: number; // Percentage watched (0-100)
  isPublished?: boolean;
}

export interface Instructor {
  id: string;
  name: string;
  image: string;
  bio: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Course {
  id: string;
  title: string;
  slug?: string; // Added to match database schema
  description: string;
  category: Category | string; // Can be object from DB or string from mock data
  image: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  instructor: Instructor | string;
  rating: number;
  students: number;
  price: string;
  tags: string[];
  lessons: Lesson[];
  totalLessons: number;
  completedLessons: number;
}

export interface UserProgress {
  courseId: string;
  completedLessons: string[];
  currentLesson: string | null;
  lastWatched: string; // ISO string
  totalProgress: number; // Percentage of course completed
  timeSpent: number; // Total time spent in minutes
  enrolledAt: string; // ISO string
}

export interface Certificate {
  id: string;
  courseId: string;
  courseName: string;
  userName: string;
  completedAt: string; // ISO string
  certificateUrl: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  enrolledCourses: string[];
  applicationStatus: 'pending' | 'shortlisted' | 'admitted';
  aptitudeTestCompleted: boolean;
  createdAt: string; // ISO string
  lastLoginStreak: number;
  longestStreak: number;
  lastLoginDate: string | null; // ISO string
  totalLearningTime: number; // Total learning time in minutes
  certificatesEarned: Certificate[];
  role?: 'user' | 'admin'; // Admin role support
}

export interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalCompletions: number;
  newUsersThisWeek: number;
  completionRate: number;
  popularCourses: { courseId: string; title: string; enrollments: number; }[];
  userGrowth: { date: string; users: number; }[];
  categoryStats: { category: string; count: number; }[];
}