import { useState, useMemo } from 'react'
import { UserStatus, UserRole } from '@/types/db/user'
import type { User } from '@/types/db/user'
import { useCreateUserByAdmin } from '@/hooks/queries/user-hooks'
import { toast } from 'sonner'

export const useUserListing = (users: User[]) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createForm, setCreateForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: ''
  })

  const createUserMutation = useCreateUserByAdmin()

  // Map role string to UserRole enum
  const getRoleFromString = (roleString: string): UserRole => {
    switch (roleString) {
      case 'Student':
        return UserRole.STUDENT
      case 'Lecturer':
        return UserRole.INSTRUCTOR
      case 'Moderator':
        return UserRole.MODERATOR
      case 'Admin':
        return UserRole.ADMIN
      default:
        return UserRole.STUDENT
    }
  }

  const handleCreateUser = async () => {
    // Validate form
    if (!createForm.email || !createForm.password || !createForm.name || !createForm.role) {
      toast.error('Please fill in all required fields')
      return
    }

    // Validate password match
    if (createForm.password !== createForm.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      await createUserMutation.mutateAsync({
        email: createForm.email,
        password: createForm.password,
        name: createForm.name,
        role: getRoleFromString(createForm.role),
      })

      // Reset form and close modal
      setCreateForm({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        role: ''
      })
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error('Failed to create user:', error)
    }
  }

  const resetCreateForm = () => {
    setCreateForm({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      role: ''
    })
  }

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesRole = roleFilter === 'all' || 
        (roleFilter === 'student' && user.role === UserRole.STUDENT) ||
        (roleFilter === 'lecturer' && user.role === UserRole.INSTRUCTOR) ||
        (roleFilter === 'mod' && user.role === UserRole.MODERATOR) ||
        (roleFilter === 'admin' && user.role === UserRole.ADMIN)
      
      return matchesSearch && matchesRole
    })
  }, [users, searchTerm, roleFilter])

  const getStatusBadge = (status: UserStatus) => {
    const statusLabels = {
      [UserStatus.ACTIVE]: 'Active',
      [UserStatus.INACTIVE]: 'Inactive',
      [UserStatus.PENDING]: 'Pending'
    } as const

    const statusColors = {
      [UserStatus.ACTIVE]: 'default',
      [UserStatus.INACTIVE]: 'outline',
      [UserStatus.PENDING]: 'secondary'
    } as const

    return { variant: statusColors[status] || 'secondary', label: statusLabels[status] || 'Unknown' }
  }

  const getRoleBadge = (role: UserRole) => {
    const roleLabels = {
      [UserRole.STUDENT]: 'Student',
      [UserRole.INSTRUCTOR]: 'Lecturer',
      [UserRole.MODERATOR]: 'Mod',
      [UserRole.ADMIN]: 'Admin'
    } as const

    const roleColors = {
      [UserRole.STUDENT]: 'secondary',
      [UserRole.INSTRUCTOR]: 'secondary',
      [UserRole.MODERATOR]: 'outline',
      [UserRole.ADMIN]: 'default'
    } as const

    return { variant: roleColors[role] || 'secondary', label: roleLabels[role] || 'Unknown' }
  }

  return {
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    filteredUsers,
    getStatusBadge,
    getRoleBadge,
    // Create user
    isCreateModalOpen,
    setIsCreateModalOpen,
    createForm,
    setCreateForm,
    handleCreateUser,
    resetCreateForm,
    createUserMutation,
  }
}

