import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { mockCourse } from '@/utils/mock-data';
import type { Module } from '@/types/db/course/module';
import type { Lesson } from '@/types/db/course/lesson';
import type { Course } from '@/types/db/course';

interface CourseLearnContextType {
  getCourseData: () => Partial<Course>;
  // Get course modules with their lessons for content listing
  getModulesWithLessons: (courseId: string) => Module[];
  // Get lesson content by course id, module id, and lesson id
  getLessonContent: (courseId: string, moduleId: string, lessonId: string) => Lesson | null;
}

const CourseLearnContext = createContext<CourseLearnContextType | undefined>(undefined);

interface CourseLearnProviderProps {
  children: ReactNode;
}

export const CourseLearnProvider: React.FC<CourseLearnProviderProps> = ({ children }) => {
  
  const getCourseData = (): Course => {
    return mockCourse;
  }
  
  
    // Get course modules with their lessons for content listing
  const getModulesWithLessons = (courseId: string): Module[] => {
    // For now, we only have one course in mock data
    if (courseId === mockCourse.id) {
      return mockCourse.modules || [];
    }
    return [];
  };

  // Get lesson content by course id, module id, and lesson id
  const getLessonContent = (courseId: string, moduleId: string, lessonId: string): Lesson | null => {
    // For now, we only have one course in mock data
    if (courseId === mockCourse.id) {
      const modules = mockCourse.modules || [];

      // Find the module
      const module = modules.find(m => m.id === moduleId);
      if (!module) return null;

      // Find the lesson in the module
      const lesson = module.lessons?.find(l => l.id === lessonId);
      if (lesson) return lesson as Lesson;
    }

    return null;
  };

  const value: CourseLearnContextType = {
    getCourseData,
    getModulesWithLessons,
    getLessonContent,
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
