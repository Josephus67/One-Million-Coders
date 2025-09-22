'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CourseLearningPage } from '@/components/CourseLearningPage';

interface LearningPageClientProps {
  lesson: any;
  course: any;
  enrollment: any;
  userId: string;
}

export default function LearningPageClient({
  lesson,
  course,
  enrollment,
  userId
}: LearningPageClientProps) {
  const router = useRouter();

  const handleBack = () => {
    router.push(`/courses/${course.slug}`);
  };

  const handleLessonComplete = async (lessonId: string, timeSpent?: number) => {
    try {
      // Update lesson progress
      const response = await fetch(`/api/enrollments/${enrollment.id}/progress`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId,
          isCompleted: true,
          timeSpent: timeSpent || 1,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update progress');
      }

      // Refresh the page to update progress
      router.refresh();
    } catch (error) {
      console.error('Error updating lesson progress:', error);
    }
  };

  const handleProgress = async (lessonId: string, progress: number, timeSpent?: number) => {
    try {
      // Update lesson watch progress
      const response = await fetch(`/api/enrollments/${enrollment.id}/progress`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId,
          watchProgress: progress,
          timeSpent: timeSpent || 0.5,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update progress');
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  // Transform enrollment data to match expected UserProgress type
  const userProgress = {
    courseId: course.id,
    currentLesson: enrollment.currentLesson,
    completedLessons: enrollment.lessonProgress
      ?.filter((lp: any) => lp.isCompleted)
      .map((lp: any) => lp.lessonId) || [],
    lastWatched: enrollment.updatedAt || new Date().toISOString(),
    totalProgress: enrollment.progress || 0,
    timeSpent: enrollment.timeSpent || 0,
    enrolledAt: enrollment.enrolledAt || enrollment.createdAt || new Date().toISOString(),
    lessonProgress: enrollment.lessonProgress?.reduce((acc: any, lp: any) => {
      acc[lp.lessonId] = {
        watchProgress: lp.watchProgress,
        isCompleted: lp.isCompleted,
        timeSpent: lp.timeSpent,
      };
      return acc;
    }, {}) || {},
  };

  return (
    <CourseLearningPage
      course={course}
      userProgress={userProgress}
      onBack={handleBack}
      onLessonComplete={handleLessonComplete}
      onProgress={handleProgress}
    />
  );
}