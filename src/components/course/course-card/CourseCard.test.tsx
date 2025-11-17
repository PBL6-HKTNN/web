import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CourseCard } from '@components/course/course-card';
import { useNavigate } from '@tanstack/react-router';
import '@testing-library/jest-dom';

// Mock useNavigate
vi.mock('@tanstack/react-router', () => ({
  useNavigate: vi.fn(),
}));

// Mock data
const mockCourse: any = {
  id: '123',
  title: 'React Advanced Patterns',
  instructorId: 'john_doe',
  thumbnail: '/images/react.jpg',
  price: 99,
  averageRating: 4.7,
  numberOfReviews: 342,
  duration: '12h 30m',
  level: 'Advanced',
};

describe('CourseCard', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders course title correctly', () => {
    render(<CourseCard course={mockCourse} />);
    expect(screen.getByText('React Advanced Patterns')).toBeInTheDocument();
  });

  it('renders instructor name when instructorId exists', () => {
    render(<CourseCard course={mockCourse} />);
    expect(screen.getByText(/By john_doe/i)).toBeInTheDocument();
  });

  it('does not render instructor when instructorId is missing', () => {
    render(<CourseCard course={{ ...mockCourse, instructorId: null }} />);
    expect(screen.queryByText(/By/i)).not.toBeInTheDocument();
  });

  it('renders rating and review count', () => {
    render(<CourseCard course={mockCourse} />);
    expect(screen.getByText('4.7')).toBeInTheDocument();
    expect(screen.getByText('(342 reviews)')).toBeInTheDocument();
  });

  it('renders duration and level with icons', () => {
    render(<CourseCard course={mockCourse} />);
    expect(screen.getByText('12h 30m')).toBeInTheDocument();
    expect(screen.getByText('Advanced')).toBeInTheDocument();
  });

  it('displays "Free" badge and text when price is 0', () => {
    const freeCourse = { ...mockCourse, price: 0 };
    render(<CourseCard course={freeCourse} />);

    // Get all elements with text 'Free'
    const freeElements = screen.getAllByText('Free');

    // Filter badge (span)
    const badge = freeElements.find(el => el.tagName === 'SPAN');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-green-600');

    // Filter price text (div)
    const priceText = freeElements.find(el => el.tagName === 'DIV');
    expect(priceText).toBeInTheDocument();
  });

  it('displays price correctly when not free', () => {
    render(<CourseCard course={mockCourse} />);
    expect(screen.getByText('$99')).toBeInTheDocument();
  });

  it('navigates to correct course detail page on click', () => {
    render(<CourseCard course={mockCourse} />);

    // Get the outer div containing the title
    const card = screen.getByText(/react advanced patterns/i).closest('div.group');
    expect(card).toBeInTheDocument();

    if (card) fireEvent.click(card);

    expect(mockNavigate).toHaveBeenCalledWith({
      to: '/course/123',
    });
  });

  it('uses placeholder image when thumbnail is missing', () => {
    const noThumbCourse = { ...mockCourse, thumbnail: null };
    render(<CourseCard course={noThumbCourse} />);

    const img = screen.getByAltText('React Advanced Patterns');
    expect(img).toHaveAttribute('src', '/placeholder-course.jpg');
  });

  it('applies hover styles and cursor pointer', () => {
    render(<CourseCard course={mockCourse} />);
    const card = screen.getByText(/react advanced patterns/i).closest('div.group');

    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('cursor-pointer');
    expect(card).toHaveClass('hover:shadow-lg');
  });
});
