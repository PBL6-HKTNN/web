import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CourseTable } from '@components/course/course-table'
import * as courseHook from '@components/course/course-table/hook'
import type { Course } from '@/types/db/course'
import { CourseStatus } from '@/types/db/course'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { JSX } from 'react'

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'React Basics',
    instructorId: 'ins1',
    categoryId: 'cat1',
    level: 0,
    averageRating: 4.5,
    numberOfReviews: 10,
    price: 100,
    numberOfModules: 5,
    thumbnail: '',
    status: CourseStatus.PUBLISHED,
    duration: '10h',
    language: 'en',
  },
  {
    id: '2',
    title: 'Advanced TypeScript',
    instructorId: 'ins2',
    categoryId: 'cat2',
    level: 2,
    averageRating: 4.8,
    numberOfReviews: 20,
    price: 200,
    numberOfModules: 8,
    thumbnail: '',
    status: CourseStatus.PUBLISHED,
    duration: '15h',
    language: 'en',
  },
]

describe('CourseTable', () => {
  const handleCourseClick = vi.fn()
  const handleLoadMore = vi.fn()
  let queryClient: QueryClient

  beforeEach(() => {
    vi.resetAllMocks()
    queryClient = new QueryClient()
  })

  const renderWithQueryClient = (ui: JSX.Element) =>
    render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)

  it('renders loading skeleton', () => {
    vi.spyOn(courseHook, 'useCourseTable').mockReturnValue({
      courses: [],
      isLoading: true,
      error: null,
      isFetching: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      filters: {},
      handleFiltersChange: vi.fn(),
      handleLoadMore,
    })

    renderWithQueryClient(<CourseTable onCourseClick={handleCourseClick} />)
    expect(screen.getAllByRole('row')).toHaveLength(13) // ITEMS_PER_PAGE skeleton
  })

  it('renders error alert', () => {
    vi.spyOn(courseHook, 'useCourseTable').mockReturnValue({
      courses: [],
      isLoading: false,
      error: new Error('Failed'),
      isFetching: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      filters: {},
      handleFiltersChange: vi.fn(),
      handleLoadMore,
    })

    renderWithQueryClient(<CourseTable onCourseClick={handleCourseClick} />)
    expect(screen.getByText(/Failed to load courses/i)).toBeInTheDocument()
  })

  it('renders empty state', () => {
    vi.spyOn(courseHook, 'useCourseTable').mockReturnValue({
      courses: [],
      isLoading: false,
      error: null,
      isFetching: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      filters: {},
      handleFiltersChange: vi.fn(),
      handleLoadMore,
    })

    renderWithQueryClient(<CourseTable onCourseClick={handleCourseClick} />)
    expect(screen.getByText(/No courses found/i)).toBeInTheDocument()
  })

  it('renders courses', () => {
    vi.spyOn(courseHook, 'useCourseTable').mockReturnValue({
      courses: mockCourses,
      isLoading: false,
      error: null,
      isFetching: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      filters: {},
      handleFiltersChange: vi.fn(),
      handleLoadMore,
    })

    renderWithQueryClient(<CourseTable onCourseClick={handleCourseClick} />)
    expect(screen.getByText(/React Basics/i)).toBeInTheDocument()
    expect(screen.getByText(/Advanced TypeScript/i)).toBeInTheDocument()
  })

  it('calls onCourseClick when row or eye button clicked', () => {
    vi.spyOn(courseHook, 'useCourseTable').mockReturnValue({
      courses: mockCourses,
      isLoading: false,
      error: null,
      isFetching: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      filters: {},
      handleFiltersChange: vi.fn(),
      handleLoadMore,
    })

    renderWithQueryClient(<CourseTable onCourseClick={handleCourseClick} />)

    fireEvent.click(screen.getByText('React Basics'))
    expect(handleCourseClick).toHaveBeenCalledWith(mockCourses[0])

    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])
    expect(handleCourseClick).toHaveBeenCalledWith(mockCourses[0])
  })

  it('renders Load More button and calls handleLoadMore', () => {
    vi.spyOn(courseHook, 'useCourseTable').mockReturnValue({
      courses: mockCourses,
      isLoading: false,
      error: null,
      isFetching: false,
      isFetchingNextPage: false,
      hasNextPage: true,
      filters: {},
      handleFiltersChange: vi.fn(),
      handleLoadMore,
    })

    renderWithQueryClient(<CourseTable onCourseClick={handleCourseClick} />)

    const loadMoreBtn = screen.getByText(/Load More Courses/i)
    fireEvent.click(loadMoreBtn)
    expect(handleLoadMore).toHaveBeenCalled()
  })
})
