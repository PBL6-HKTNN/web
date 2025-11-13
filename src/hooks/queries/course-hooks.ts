import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCourses,
  getCourseById,
  getCategories,
  getEnrolledCourses,
  getWishlist,
  enrollCourse,
  addToWishlist,
  removeFromWishlist,
  updateProgress
} from '@/services';
import { mockCourses, mockCategories, mockEnrolledCourses, mockWishlistItems } from '@/utils/mock-data';
import type {
  Course,
  GetCoursesRequest,
  GetCoursesResponse,
  GetCategoriesResponse,
  Category,
  EnrolledCourse,
  WishlistItem,
  GetEnrolledCoursesResponse,
  GetWishlistResponse
} from '@/types/db/course/course';

// Flag to enable/disable mock data (set to true when backend is not available)
const USE_MOCK_DATA = false;

// Helper function to filter and sort mock courses
const getFilteredCourses = (params?: GetCoursesRequest): GetCoursesResponse => {
  let filteredCourses = [...mockCourses];

  // Apply filters
  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    filteredCourses = filteredCourses.filter(course =>
      course.title.toLowerCase().includes(searchLower) ||
      course.description.toLowerCase().includes(searchLower) ||
      course.instructor?.name.toLowerCase().includes(searchLower)
    );
  }

  if (params?.categoryId) {
    filteredCourses = filteredCourses.filter(course => course.categoryId === params.categoryId);
  }

  if (params?.level) {
    filteredCourses = filteredCourses.filter(course => course.level === params.level);
  }

  if (params?.minPrice !== undefined) {
    filteredCourses = filteredCourses.filter(course => course.price >= params.minPrice!);
  }

  if (params?.maxPrice !== undefined && params.maxPrice < 200) {
    filteredCourses = filteredCourses.filter(course => course.price <= params.maxPrice!);
  }

  // Apply sorting
  const sortBy = params?.sortBy || 'createdAt';
  const sortOrder = params?.sortOrder || 'desc';

  filteredCourses.sort((a, b) => {
    let aValue: number | string, bValue: number | string;

    switch (sortBy) {
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'price':
        aValue = a.price;
        bValue = b.price;
        break;
      case 'rating':
        aValue = a.averageRating;
        bValue = b.averageRating;
        break;
      case 'numberOfReviews':
        aValue = a.numberOfReviews;
        bValue = b.numberOfReviews;
        break;
      case 'createdAt':
      default:
        // For mock data, we'll sort by id (newer courses have higher ids)
        aValue = parseInt(a.id.split('-')[1]);
        bValue = parseInt(b.id.split('-')[1]);
        break;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });

  // Apply pagination
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 12;
  const totalCount = filteredCourses.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + pageSize);

  return {
    courses: paginatedCourses as unknown as Course[],
    totalCount,
    page,
    pageSize,
    totalPages,
  };
};

export const useCourses = (params?: GetCoursesRequest) => {
  return useQuery<GetCoursesResponse, Error>({
    queryKey: ['courses', params],
    queryFn: USE_MOCK_DATA
      ? () => Promise.resolve(getFilteredCourses(params))
      : () => getCourses(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCourseById = (id: string, enabled: boolean = true) => {
  return useQuery<Course, Error>({
    queryKey: ['course', id],
    queryFn: USE_MOCK_DATA
      ? () => Promise.resolve(mockCourses.find(course => course.id === id) as unknown as Course)
      : () => getCourseById(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCategories = () => {
  return useQuery<GetCategoriesResponse, Error>({
    queryKey: ['categories'],
    queryFn: USE_MOCK_DATA
      ? () => Promise.resolve({ categories: mockCategories as unknown as Category[] })
      : getCategories,
    staleTime: 30 * 60 * 1000, // 30 minutes - categories don't change often
  });
};



// User courses hooks
export const useEnrolledCourses = () => {
  return useQuery<GetEnrolledCoursesResponse, Error>({
    queryKey: ['enrolled-courses'],
    queryFn: USE_MOCK_DATA
      ? () => Promise.resolve({ enrolledCourses: mockEnrolledCourses as unknown as EnrolledCourse[], totalCount: mockEnrolledCourses.length })
      : getEnrolledCourses,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useWishlist = () => {
  return useQuery<GetWishlistResponse, Error>({
    queryKey: ['wishlist'],
    queryFn: USE_MOCK_DATA
      ? () => Promise.resolve({ wishlistItems: mockWishlistItems as unknown as WishlistItem[], totalCount: mockWishlistItems.length })
      : getWishlist,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useEnrollCourse = () => {
  const queryClient = useQueryClient();

  return useMutation<EnrolledCourse, Error, string>({
    mutationFn: enrollCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrolled-courses'] });
    },
  });
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation<WishlistItem, Error, string>({
    mutationFn: addToWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: removeFromWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
};

export const useUpdateProgress = () => {
  const queryClient = useQueryClient();

  return useMutation<EnrolledCourse, Error, { courseId: string; progressData: { progressPercentage: number; completedLectures: number } }>({
    mutationFn: ({ courseId, progressData }) => updateProgress(courseId, progressData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrolled-courses'] });
    },
  });
};
