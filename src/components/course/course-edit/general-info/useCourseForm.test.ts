import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCourseForm } from './hook';
import { useGetCourseById, useCreateCourse, useUpdateCourse } from '@/hooks/queries/course/course-hooks';
import { useGetCategories } from '@/hooks/queries/course/category-hooks';
import { useToast } from '@/hooks/use-toast';

vi.mock('@/hooks/queries/course/course-hooks');
vi.mock('@/hooks/queries/course/category-hooks');
vi.mock('@/hooks/use-toast');
vi.mock('uuid', () => ({
  v4: () => 'mock-uuid-123',
}));

describe('useCourseForm', () => {
  const mockOnSuccess = vi.fn();
  const mockOnError = vi.fn();
  const mockSuccessToast = vi.fn();
  const mockErrorToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useToast).mockReturnValue({
      success: mockSuccessToast,
      error: mockErrorToast,
    } as any);

    vi.mocked(useGetCategories).mockReturnValue({
      data: { data: [{ id: 'cat1', name: 'React' }] },
      isLoading: false,
    } as any);
  });

  it('Create initializes default values when creating new', () => {
    vi.mocked(useGetCourseById).mockReturnValue({ data: null, isLoading: false } as any);
    vi.mocked(useCreateCourse).mockReturnValue({ mutateAsync: vi.fn(), isPending: false } as any);
    vi.mocked(useUpdateCourse).mockReturnValue({ mutateAsync: vi.fn(), isPending: false } as any);

    const { result } = renderHook(() => useCourseForm({ instructorId: 'inst1', onSuccess: mockOnSuccess }));

    expect(result.current.form.getValues()).toEqual({
      title: '',
      description: '',
      thumbnail: '',
      categoryId: '',
      price: 0,
      level: 0,
      language: '',
    });
  });

  it('loads course data when editing', () => {
    const mockCourse = {
      data: {
        id: 'course1',
        title: 'React Master',
        description: 'Advanced React',
        thumbnail: '/thumb.jpg',
        categoryId: 'cat1',
        price: 99,
        level: 2,
        language: 'en',
      },
    };

    vi.mocked(useGetCourseById).mockReturnValue({ data: mockCourse, isLoading: false } as any);
    vi.mocked(useCreateCourse).mockReturnValue({ mutateAsync: vi.fn(), isPending: false } as any);
    vi.mocked(useUpdateCourse).mockReturnValue({ mutateAsync: vi.fn(), isPending: false } as any);

    const { result } = renderHook(() =>
      useCourseForm({ courseId: 'course1', instructorId: 'inst1' })
    );

    expect(result.current.form.getValues()).toEqual({
      title: 'React Master',
      description: 'Advanced React',
      thumbnail: '/thumb.jpg',
      categoryId: 'cat1',
      price: 99,
      level: 2,
      language: 'en',
    });
  });

  it('calls create mutation and shows success toast', async () => {
    const mockCreate = vi.fn().mockResolvedValue({ data: { id: 'new-course-1' } });
    vi.mocked(useCreateCourse).mockReturnValue({ mutateAsync: mockCreate, isPending: false } as any);
    vi.mocked(useGetCourseById).mockReturnValue({ data: null, isLoading: false } as any);

    const { result } = renderHook(() =>
      useCourseForm({ instructorId: 'inst1', onSuccess: mockOnSuccess })
    );

    await act(async () => {
      result.current.form.setValue('title', 'New Course');
      result.current.form.setValue('categoryId', 'cat1');
      result.current.form.setValue('description', 'Course description');
      result.current.form.setValue('price', 199);
      result.current.form.setValue('level', 2);

      // The correct & stable way: call handleSubmit with preventDefault mock
      await result.current.onValidSubmit(result.current.form.getValues());
    });

    expect(mockCreate).toHaveBeenCalledWith({
      instructorId: 'inst1',
      title: 'New Course',
      description: 'Course description',
      thumbnail: null,
      categoryId: 'cat1',
      price: 199,
      level: 2,
      language: '',
    });
    expect(mockSuccessToast).toHaveBeenCalledWith('Course created successfully');
    expect(mockOnSuccess).toHaveBeenCalledWith('new-course-1');
  });

  it('calls update mutation and shows success toast', async () => {
    const mockUpdate = vi.fn().mockResolvedValue({});
    const mockCourse = {
      data: {
        id: 'course1',
        title: 'Old Title',
        description: 'Old description',
        thumbnail: '/old.jpg',
        categoryId: 'cat1',
        price: 99,
        level: 1,
        language: 'en',
      },
    };

    vi.mocked(useGetCourseById).mockReturnValue({ data: mockCourse, isLoading: false } as any);
    vi.mocked(useUpdateCourse).mockReturnValue({ mutateAsync: mockUpdate, isPending: false } as any);

    const { result } = renderHook(() =>
      useCourseForm({ courseId: 'course1', instructorId: 'inst1', onSuccess: mockOnSuccess })
    );

    await act(async () => {
      result.current.form.setValue('title', 'Updated Title');
      result.current.form.setValue('price', 299);

        await result.current.onValidSubmit(result.current.form.getValues());
    });

    expect(mockUpdate).toHaveBeenCalledWith({
      courseId: 'course1',
      data: {
        instructorId: 'inst1',
        title: 'Updated Title',
        description: 'Old description',
        thumbnail: '/old.jpg',
        categoryId: 'cat1',
        price: 299,
        level: 1,
        language: 'en',
      },
    });
    expect(mockSuccessToast).toHaveBeenCalledWith('Course updated successfully');
    expect(mockOnSuccess).toHaveBeenCalledWith('course1');
  });

  it('handles error when creating course', async () => {
    const mockCreate = vi.fn().mockRejectedValue(new Error('Network error'));
    vi.mocked(useCreateCourse).mockReturnValue({ mutateAsync: mockCreate, isPending: false } as any);
    vi.mocked(useGetCourseById).mockReturnValue({ data: null, isLoading: false } as any);

    const { result } = renderHook(() =>
      useCourseForm({ instructorId: 'inst1', onError: mockOnError })
    );

    await act(async () => {
      result.current.form.setValue('title', 'Fail Course');
      result.current.form.setValue('categoryId', 'cat1');

      await result.current.onValidSubmit(result.current.form.getValues());
    });

    expect(mockErrorToast).toHaveBeenCalledWith('Failed to save course: Network error');
    expect(mockOnError).toHaveBeenCalledWith('Network error');
  });

  it('returns the correct list of categories', () => {
    vi.mocked(useGetCourseById).mockReturnValue({ data: null, isLoading: false } as any);

    const { result } = renderHook(() => useCourseForm({ instructorId: 'inst1' }));

    expect(result.current.categories).toEqual([{ id: 'cat1', name: 'React' }]);
    expect(result.current.isLoadingCategories).toBe(false);
  });
});