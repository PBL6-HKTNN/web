import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CourseList } from "./index";
import {
  CourseStatus,
  type Course,
  type GetCoursesFilterReq,
} from "@/types/db/course";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { JSX } from "react";

// Mock data
const mockCourses: Course[] = [
  {
    id: "1",
    title: "React Basics",
    instructorId: "ins1",
    categoryId: "cat1",
    level: 0,
    averageRating: 4.5,
    numberOfReviews: 10,
    price: 100,
    numberOfModules: 5,
    thumbnail: "",
    status: CourseStatus.PUBLISHED,
    duration: "5h",
    language: "English",
    totalEnrollments: 0,
  },
  {
    id: "2",
    title: "Advanced TypeScript",
    instructorId: "ins2",
    categoryId: "cat2",
    level: 2,
    averageRating: 4.8,
    numberOfReviews: 20,
    price: 200,
    numberOfModules: 8,
    thumbnail: "",
    status: CourseStatus.PUBLISHED,
    duration: "8h",
    language: "English",
    totalEnrollments: 0,
  },
];

describe("CourseList", () => {
  const onFiltersChange = vi.fn();
  const onLoadMore = vi.fn();
  const defaultFilters: GetCoursesFilterReq = {};

  let queryClient: QueryClient;

  beforeEach(() => {
    vi.resetAllMocks();
    queryClient = new QueryClient();
  });

  const renderWithQueryClient = (ui: JSX.Element) => {
    return render(
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    );
  };

  it("renders loading skeleton", () => {
    renderWithQueryClient(
      <CourseList
        courses={[]}
        isLoading={true}
        error={null}
        isFetching={false}
        isFetchingNextPage={false}
        hasNextPage={false}
        filters={defaultFilters}
        onFiltersChange={onFiltersChange}
        onLoadMore={onLoadMore}
      />
    );

    // Check for skeleton elements
    expect(
      document.querySelectorAll('[data-slot="skeleton"]').length
    ).toBeGreaterThan(0);
  });

  it("renders error alert", () => {
    renderWithQueryClient(
      <CourseList
        courses={[]}
        isLoading={false}
        error={new Error("Failed")}
        isFetching={false}
        isFetchingNextPage={false}
        hasNextPage={false}
        filters={defaultFilters}
        onFiltersChange={onFiltersChange}
        onLoadMore={onLoadMore}
      />
    );

    expect(screen.getByText(/Failed to load courses/i)).toBeInTheDocument();
  });

  it("renders empty state", () => {
    renderWithQueryClient(
      <CourseList
        courses={[]}
        isLoading={false}
        error={null}
        isFetching={false}
        isFetchingNextPage={false}
        hasNextPage={false}
        filters={defaultFilters}
        onFiltersChange={onFiltersChange}
        onLoadMore={onLoadMore}
      />
    );

    expect(screen.getByText(/No courses found/i)).toBeInTheDocument();
  });

  it("renders courses", () => {
    renderWithQueryClient(
      <CourseList
        courses={mockCourses}
        isLoading={false}
        error={null}
        isFetching={false}
        isFetchingNextPage={false}
        hasNextPage={false}
        filters={defaultFilters}
        onFiltersChange={onFiltersChange}
        onLoadMore={onLoadMore}
      />
    );

    expect(screen.getByText(/React Basics/i)).toBeInTheDocument();
    expect(screen.getByText(/Advanced TypeScript/i)).toBeInTheDocument();
  });

  it("calls onLoadMore when Load More button clicked", () => {
    renderWithQueryClient(
      <CourseList
        courses={mockCourses}
        isLoading={false}
        error={null}
        isFetching={false}
        isFetchingNextPage={false}
        hasNextPage={true}
        filters={defaultFilters}
        onFiltersChange={onFiltersChange}
        onLoadMore={onLoadMore}
      />
    );

    const loadMoreBtn = screen.getByText(/Load More Courses/i);
    fireEvent.click(loadMoreBtn);
    expect(onLoadMore).toHaveBeenCalled();
  });

  it("renders loading overlay when fetching", () => {
    renderWithQueryClient(
      <CourseList
        courses={mockCourses}
        isLoading={false}
        error={null}
        isFetching={true}
        isFetchingNextPage={false}
        hasNextPage={false}
        filters={defaultFilters}
        onFiltersChange={onFiltersChange}
        onLoadMore={onLoadMore}
      />
    );

    expect(screen.getByText(/Loading courses/i)).toBeInTheDocument();
  });
});
