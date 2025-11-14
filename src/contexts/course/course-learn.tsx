import React, { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useGetCourseContentById } from '@/hooks/queries/course/course-hooks';

import type { Module } from '@/types/db/course/module';
import type { Lesson } from '@/types/db/course/lesson';
import type { Course } from '@/types/db/course';
import type { UUID } from '@/types';

interface CourseLearnContextType {
  // Course data
  courseData: Course | undefined;
  courseLoading: boolean;
  courseError: Error | null;
  
  // Modules with lessons data for content listing
  modulesWithLessons: Module[];
  
  // Helper functions
  getLessonFromModules: (moduleId: string, lessonId: string) => Lesson | null;
}

interface CourseLearnProviderProps {
  children: ReactNode;
  courseId: UUID;
}

const CourseLearnContext = createContext<CourseLearnContextType | undefined>(undefined);

interface CourseLearnProviderProps {
  children: ReactNode;
}

export const CourseLearnProvider: React.FC<CourseLearnProviderProps> = ({ 
  children, 
  courseId 
}) => {
  // Fetch course data
  const {
    data: courseData,
    isLoading: courseLoading,
    error: courseError,
  } = useGetCourseContentById(courseId);

  // For now, we'll use a simple approach without dynamic lesson fetching
  // The lessons will be fetched when specifically needed for content rendering
  const modulesWithLessons = useMemo(() => {
    if (!courseData?.data) return [];

    return courseData.data.module.map((module: Module) => ({
      ...module,
      lessons: module.lessons || [], // Use lessons from API response
    }));
  }, [courseData]);

  // Helper function to find lesson in modules
  const getLessonFromModules = (moduleId: string, lessonId: string): Lesson | null => {
    const module = modulesWithLessons.find((m: Module) => m.id === moduleId);
    if (!module || !module.lessons) return null;

    return module.lessons.find((l: Lesson) => l.id === lessonId) || null;
  };

  const value: CourseLearnContextType = {
    courseData: courseData?.data?.course || undefined,
    courseLoading,
    courseError,
    modulesWithLessons,
    getLessonFromModules,
  };

  return (
    <CourseLearnContext.Provider value={value}>
      {children}
    </CourseLearnContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCourseLearn = (): CourseLearnContextType => {
  const context = useContext(CourseLearnContext);
  if (context === undefined) {
    throw new Error('useCourseLearn must be used within a CourseLearnProvider');
  }
  return context;
};
