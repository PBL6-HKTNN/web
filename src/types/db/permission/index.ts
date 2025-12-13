import type { Base } from "@/types/core/base"
export type PermissionAction = Base & {
  name: string
  description: string
  code: string
}

export type Permission = Base & {
  permissionName: string
  actions: PermissionAction[]
}
export interface CreatePermissionRequest {
    name: string
    actionIds: string[]
  }

export interface AssignPermissionRequest {
  userId: string
  permissionId: string
}

export type UserPermission = Base & {
  permissionName: string
}

export type UserPermissionGroup = Base & {
  userId: string | null
  roleId: number | null
  permissionId: string
}