import api from "@/utils/api"
import API_ROUTES from "@/conf/constants/api-routes"
import type { Permission, CreatePermissionRequest, AssignPermissionRequest, UserPermission, UserPermissionGroup } from "@/types/db/permission"
import type { User } from "@/types/db/user"
import type { AxiosError } from "axios"

type ApiError = AxiosError<{
  error?: {
    message?: string
  }
}>

export const getPermissions = async (): Promise<Permission[]> => {
  const response = await api.get(API_ROUTES.PERMISSION.list)
  return response.data.data
}

export const getPermissionById = async (permissionId: string): Promise<Permission> => {
  const response = await api.get(API_ROUTES.PERMISSION.getById(permissionId))
  return response.data.data
}

export const createPermission = async (data: CreatePermissionRequest): Promise<Permission> => {
  const response = await api.post(API_ROUTES.PERMISSION.create, data)
  return response.data.data
}

export const updatePermission = async (permissionId: string, data: CreatePermissionRequest): Promise<Permission> => {
  const response = await api.post(API_ROUTES.PERMISSION.update(permissionId), data)
  return response.data.data
}

export const deletePermission = async (permissionId: string): Promise<void> => {
  await api.delete(API_ROUTES.PERMISSION.delete(permissionId))
}

export const assignPermissionToUser = async (data: AssignPermissionRequest): Promise<void> => {
  await api.post(API_ROUTES.PERMISSION.assign, data)
}

export const removeUserPermission = async (userPermissionId: string): Promise<void> => {
  await api.delete(API_ROUTES.PERMISSION.removeUserPermission(userPermissionId))
}

export const getUsersByPermissionId = async (permissionId: string): Promise<User[]> => {
  try {
    const response = await api.get(API_ROUTES.PERMISSION.getUserInPermission(permissionId))
    return response.data.data
  } catch (error) {
    const apiError = error as ApiError
    if (
      apiError?.response?.status === 400 &&
      apiError?.response?.data?.error?.message === "No users found for this permission."
    ) {
      return []
    }
    throw error
  }
}

export const getUserPermissions = async (userId: string): Promise<UserPermission[]> => {
  try {
    const response = await api.get(API_ROUTES.USER.getPermissions(userId))
    // API returns userPermissionGroups: { id, userId, roleId, permissionId, ... }
    // We need to map them to UserPermission[] format
    // Note: permissionName will be filled in component using allPermissions
    const userPermissionGroups = response.data.data || []
    return userPermissionGroups.map((upg: UserPermissionGroup ) => ({
      id: upg.id, // UserPermissionGroup ID (needed for removal)
      permissionId: upg.permissionId, // Permission ID (needed for comparison)
      permissionName: '', // Will be filled in component
      createdAt: upg.createdAt,
      updatedAt: upg.updatedAt,
    })) as UserPermission[] // Using any[] because we're adding permissionId field
  } catch (error) {
    const apiError = error as ApiError
    // Handle case when no permissions found
    if (
      apiError?.response?.status === 400 &&
      (apiError?.response?.data?.error?.message?.includes("No permission") ||
       apiError?.response?.data?.error?.message?.includes("User not found"))
    ) {
      return []
    }
    throw error
  }
}
