// Mock data for admin permissions management
export const groupedPermissions = {
  'Lecturer': [
    'Create Course',
    'Edit Course',
    'Delete Course',
    'View Course',
    'View Reports',
    'Manage Students'
  ],
  'Moderator': [
    'Review Course',
    'Approve Course',
    'Reject Course',
    'View Reports',
    'Manage Comments'
  ],
  'Student': [
    'Enroll Course',
    'View Course',
    'Access Learning Materials',
    'Submit Assignment'
  ],
}

export const permissionGroups = [
  {
    id: '1',
    name: 'Lecturer',
    description: 'Giảng viên có thể tạo và quản lý khóa học',
    status: 'Active',
    createdAt: '2023-06-15',
    userCount: 25,
    permissions: [
      'Create Course',
      'Edit Course',
      'Delete Course',
      'View Reports',
      'Manage Students'
    ]
  },
  {
    id: '2',
    name: 'Moderator',
    description: 'Moderator có thể duyệt và kiểm tra nội dung',
    status: 'Active',
    createdAt: '2023-09-22',
    userCount: 8,
    permissions: [
      'Review Course',
      'Approve Course',
      'Reject Course',
      'View Reports',
      'Manage Comments'
    ]
  },
  {
    id: '3',
    name: 'Student',
    description: 'Học viên có thể tham gia khóa học và xem nội dung',
    status: 'Active',
    createdAt: '2024-01-10',
    userCount: 150,
    permissions: [
      'Enroll Course',
      'View Course',
      'Submit Assignment',
      'Access Learning Materials'
    ]
  },
]
