import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { UserProfile, UserProgress } from '../types/course';
import { getCourseById, getAllCourses } from '../data/mockCourses';
import { 
  BookOpen, 
  Clock, 
  Star, 
  Users, 
  TrendingUp,
  Target,
  Brain,
  Zap
} from 'lucide-react';

interface CourseRecommendationsProps {
  user: UserProfile;
  progress: UserProgress[];
  onCourseSelect: (courseId: string) => void;
  onEnrollCourse: (courseId: string) => Promise<boolean>;
}

export function CourseRecommendations({ user, progress, onCourseSelect, onEnrollCourse }: CourseRecommendationsProps) {
  const allCourses = getAllCourses();
  
  // Get user's completed and enrolled courses
  const enrolledCourseIds = user.enrolledCourses;
  const completedCourses = progress
    .filter(p => {
      const course = getCourseById(p.courseId);
      return course && p.completedLessons.length >= course.lessons.length;
    })
    .map(p => p.courseId);

  // Get user's preferred categories based on enrolled courses
  const enrolledCourses = enrolledCourseIds.map(id => getCourseById(id)).filter(Boolean);
  const categoryPreferences = enrolledCourses.reduce((acc, course) => {
    acc[course!.category] = (acc[course!.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get skill level based on completed courses
  const getSkillLevel = () => {
    if (completedCourses.length >= 5) return 'Advanced';
    if (completedCourses.length >= 2) return 'Intermediate';
    return 'Beginner';
  };

  const userSkillLevel = getSkillLevel();

  // Algorithm for course recommendations
  const getRecommendations = () => {
    const availableCourses = allCourses.filter(course => 
      !enrolledCourseIds.includes(course.id)
    );

    const scoredCourses = availableCourses.map(course => {
      let score = 0;
      
      // Category preference score (40% weight)
      if (categoryPreferences[course.category]) {
        score += categoryPreferences[course.category] * 40;
      }
      
      // Skill level match (30% weight)
      if (course.level === userSkillLevel) {
        score += 30;
      } else if (
        (userSkillLevel === 'Beginner' && course.level === 'Intermediate') ||
        (userSkillLevel === 'Intermediate' && course.level === 'Advanced')
      ) {
        score += 20; // Next level up gets some points
      }
      
      // Popular courses (20% weight)
      score += (course.students / 1000) * 20;
      
      // High-rated courses (10% weight)
      score += course.rating * 2;
      
      return { ...course, score };
    });

    return scoredCourses.sort((a, b) => b.score - a.score);
  };

  const recommendedCourses = getRecommendations().slice(0, 6);
  
  // Get courses in user's favorite category
  const favoriteCategory = Object.keys(categoryPreferences).reduce((a, b) => 
    categoryPreferences[a] > categoryPreferences[b] ? a : b, 
    Object.keys(categoryPreferences)[0]
  );

  const categoryRecommendations = allCourses
    .filter(course => 
      course.category === favoriteCategory && 
      !enrolledCourseIds.includes(course.id)
    )
    .slice(0, 3);

  // Trending courses (mock data based on ratings and students)
  const trendingCourses = allCourses
    .filter(course => !enrolledCourseIds.includes(course.id))
    .sort((a, b) => (b.rating * b.students) - (a.rating * a.students))
    .slice(0, 3);

  const CourseCard = ({ course, reason }: { course: any; reason?: string }) => (
    <Card className="hover:shadow-lg transition-all duration-200 border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2 mb-2">{course.title}</CardTitle>
            <CardDescription className="line-clamp-3 text-sm">{course.description}</CardDescription>
          </div>
          <div className="ml-4 flex-shrink-0">
            <Badge variant="secondary" className="mb-2">{course.level}</Badge>
          </div>
        </div>
        
        {reason && (
          <div className="flex items-center space-x-2 mt-2">
            <Brain className="w-4 h-4 text-purple-600" />
            <span className="text-xs text-purple-600 font-medium">{reason}</span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{course.students?.toLocaleString() || 0}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{course.rating}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200">
              {course.category?.name || course.category || 'Uncategorized'}
            </Badge>
            <span className="font-semibold text-green-600">{course.price}</span>
          </div>
          
          <div className="flex space-x-2 pt-2">
            <Button
              size="sm"
              className="flex-1"
              onClick={async () => {
                const success = await onEnrollCourse(course.id);
                if (success) {
                  onCourseSelect(course.id);
                }
              }}
            >
              Enroll Now
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCourseSelect(course.id)}
            >
              Preview
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Personalized Recommendations */}
      <section>
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Recommended for You</h2>
            <p className="text-slate-600">Based on your learning history and preferences</p>
          </div>
        </div>
        
        {recommendedCourses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recommendedCourses.slice(0, 3).map((course) => (
              <CourseCard 
                key={course.id} 
                course={course} 
                reason="Matches your interests"
              />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Brain className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">Building Your Profile</h3>
            <p className="text-slate-600">
              Enroll in a few courses to get personalized recommendations!
            </p>
          </Card>
        )}
      </section>

      {/* Category-based Recommendations */}
      {favoriteCategory && categoryRecommendations.length > 0 && (
        <section>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">More in {favoriteCategory}</h2>
              <p className="text-slate-600">Continue exploring your favorite category</p>
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categoryRecommendations.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course} 
                reason={`Popular in ${favoriteCategory}`}
              />
            ))}
          </div>
        </section>
      )}

      {/* Trending Courses */}
      <section>
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Trending Now</h2>
            <p className="text-slate-600">Popular courses among the community</p>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trendingCourses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              reason="Trending in community"
            />
          ))}
        </div>
      </section>

      {/* Learning Path Suggestions */}
      <section>
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Skill Up Next</h2>
            <p className="text-slate-600">Courses to advance to the next level</p>
          </div>
        </div>
        
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">Your Learning Level</h3>
                <p className="text-sm text-slate-600">Current: {userSkillLevel}</p>
              </div>
              <Badge className="bg-blue-100 text-blue-700">{completedCourses.length} courses completed</Badge>
            </div>
            
            <Progress value={Math.min((completedCourses.length / 10) * 100, 100)} className="h-2" />
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-2">Next Milestone</h4>
                <p className="text-sm text-slate-600">
                  Complete {Math.max(2 - completedCourses.length, 0)} more courses to reach Intermediate level
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-2">Suggested Path</h4>
                <p className="text-sm text-slate-600">
                  Focus on {favoriteCategory || 'Programming'} fundamentals first
                </p>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}