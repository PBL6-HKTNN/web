// Mock data for mod users detail pages (students and instructors)
export const usersData = {
  '1': {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Student',
    status: 'Active',
    joinDate: '2024-01-15',
    lastLogin: '2024-11-20 14:30',
    avatar: '/placeholder-avatar.jpg',
    bio: 'Passionate learner interested in web development and data science.',
    location: 'New York, USA',
    coursesEnrolled: 5,
    coursesCompleted: 3,
    totalSpent: 299.99,
    averageRating: 4.7,
    enrolledCourses: [
      { id: 'C001', title: 'React Masterclass', progress: 85, enrolledDate: '2024-10-01', status: 'In Progress' },
      { id: 'C002', title: 'JavaScript Fundamentals', progress: 100, enrolledDate: '2024-09-15', status: 'Completed' },
      { id: 'C003', title: 'Python for Data Science', progress: 60, enrolledDate: '2024-11-01', status: 'In Progress' },
      { id: 'C004', title: 'Web Development Bootcamp', progress: 100, enrolledDate: '2024-08-20', status: 'Completed' },
      { id: 'C005', title: 'Machine Learning Basics', progress: 100, enrolledDate: '2024-07-10', status: 'Completed' },
    ],
    recentActivity: [
      { id: 1, action: 'Completed course', details: 'JavaScript Fundamentals', time: '2 days ago', type: 'completion' },
      { id: 2, action: 'Enrolled in course', details: 'Python for Data Science', time: '5 days ago', type: 'enrollment' },
      { id: 3, action: 'Left review', details: 'React Masterclass (5 stars)', time: '1 week ago', type: 'review' },
      { id: 4, action: 'Updated profile', details: 'Changed bio and location', time: '2 weeks ago', type: 'profile' },
    ]
  },
  '2': {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'Instructor',
    status: 'Active',
    joinDate: '2023-08-22',
    lastLogin: '2024-11-19 09:15',
    avatar: '/placeholder-avatar.jpg',
    bio: 'Experienced software engineer and educator with 8+ years of industry experience.',
    location: 'San Francisco, USA',
    coursesCreated: 12,
    totalEarnings: 2500.00,
    averageRating: 4.8,
    studentsTaught: 1250,
    enrolledCourses: [
      { id: 'C008', title: 'Machine Learning Basics', progress: 75, enrolledDate: '2024-10-15', status: 'In Progress' },
      { id: 'C009', title: 'Data Visualization', progress: 100, enrolledDate: '2024-09-01', status: 'Completed' },
    ],
    createdCourses: [
      { id: 'C001', title: 'React Masterclass', students: 450, rating: 4.9, revenue: 899.99, status: 'Published' },
      { id: 'C006', title: 'Advanced Node.js', students: 320, rating: 4.7, revenue: 639.99, status: 'Published' },
      { id: 'C007', title: 'GraphQL Essentials', students: 180, rating: 4.6, revenue: 359.99, status: 'Published' },
    ],
    recentActivity: [
      { id: 1, action: 'Course published', details: 'GraphQL Essentials', time: '1 day ago', type: 'publication' },
      { id: 2, action: 'Received payment', details: '$250.00 course revenue', time: '3 days ago', type: 'payment' },
      { id: 3, action: 'Student review', details: 'New 5-star review on React Masterclass', time: '1 week ago', type: 'review' },
      { id: 4, action: 'Updated course', details: 'Added new section to Advanced Node.js', time: '2 weeks ago', type: 'update' },
    ]
  },

  '3': {
    id: '3',
    name: 'Alice Brown',
    email: 'alice.brown@example.com',
    role: 'Student',
    status: 'Suspended',
    joinDate: '2024-03-05',
    lastLogin: '2024-10-15 16:20',
    avatar: '/placeholder-avatar.jpg',
    bio: 'Learning enthusiast exploring various technologies.',
    location: 'Toronto, Canada',
    coursesEnrolled: 2,
    coursesCompleted: 1,
    totalSpent: 99.99,
    suspensionReason: 'Multiple reports of inappropriate behavior in course discussions',
    enrolledCourses: [
      { id: 'C004', title: 'Web Development Bootcamp', progress: 100, enrolledDate: '2024-08-20', status: 'Completed' },
      { id: 'C008', title: 'Mobile App Development', progress: 25, enrolledDate: '2024-09-10', status: 'Suspended' },
    ],
    recentActivity: [
      { id: 1, action: 'Account suspended', details: 'Violation of community guidelines', time: '1 month ago', type: 'suspension' },
      { id: 2, action: 'Completed course', details: 'Web Development Bootcamp', time: '2 months ago', type: 'completion' },
      { id: 3, action: 'Enrolled in course', details: 'Mobile App Development', time: '3 months ago', type: 'enrollment' },
    ]
  },
  '4': {
    id: '4',
    name: 'Charlie Wilson',
    email: 'charlie.wilson@example.com',
    role: 'Student',
    status: 'Inactive',
    joinDate: '2024-07-18',
    lastLogin: '2024-09-30 13:10',
    avatar: '/placeholder-avatar.jpg',
    bio: 'Beginner programmer learning to code.',
    location: 'Sydney, Australia',
    coursesEnrolled: 1,
    coursesCompleted: 0,
    totalSpent: 49.99,
    enrolledCourses: [
      { id: 'C002', title: 'JavaScript Fundamentals', progress: 30, enrolledDate: '2024-07-20', status: 'In Progress' },
    ],
    recentActivity: [
      { id: 1, action: 'Last login', details: 'Accessed platform', time: '2 months ago', type: 'login' },
      { id: 2, action: 'Enrolled in course', details: 'JavaScript Fundamentals', time: '4 months ago', type: 'enrollment' },
      { id: 3, action: 'Account created', details: 'Joined the platform', time: '4 months ago', type: 'registration' },
    ]
  }
}
