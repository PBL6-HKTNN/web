import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPermissions, getPermissionById, createPermission, updatePermission, deletePermission, assignPermissionToUser, removeUserPermission, getUsersByPermissionId, getUserPermissions } from "@/services/permission-service";
import type { CreatePermissionRequest } from "@/types/db/permission";

export const permissionQueryKeys = {
  allPermissions: ["permissions"] as const,
  permissionsList: () => [...permissionQueryKeys.allPermissions, "list"] as const,
  permissionDetail: (permissionId: string) =>
    [...permissionQueryKeys.allPermissions, "detail", permissionId] as const,
  permissionUsers: (permissionId: string) =>
    [...permissionQueryKeys.allPermissions, "users", permissionId] as const,
  userPermissions: (userId: string) =>
    [...permissionQueryKeys.allPermissions, "user-permissions", userId] as const,
};

export const usePermissions = () => {
  return useQuery({
    queryKey: permissionQueryKeys.permissionsList(),
    queryFn: getPermissions,
  });
};

export const usePermission = (permissionId: string) => {
  return useQuery({
    queryKey: permissionQueryKeys.permissionDetail(permissionId),
    queryFn: () => getPermissionById(permissionId),
    enabled: !!permissionId,
  });
};

export const useCreatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPermission,
    onSuccess: () => {
      // Invalidate and refetch permissions list
      queryClient.invalidateQueries({ queryKey: permissionQueryKeys.permissionsList() });
    },
  });
};

export const useUpdatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ permissionId, data }: { permissionId: string; data: CreatePermissionRequest }) =>
      updatePermission(permissionId, data),
    onSuccess: () => {
      // Invalidate and refetch permissions list
      queryClient.invalidateQueries({ queryKey: permissionQueryKeys.permissionsList() });
    },
  });
};

export const useDeletePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePermission,
    onSuccess: () => {
      // Invalidate and refetch permissions list
      queryClient.invalidateQueries({ queryKey: permissionQueryKeys.permissionsList() });
    },
  });
};

export const useAssignPermissionToUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignPermissionToUser,
    onSuccess: (_, variables) => {
      // Invalidate user data to refetch updated permissions
      queryClient.invalidateQueries({ queryKey: ["users"] });
      // Invalidate user permissions for the specific user
      queryClient.invalidateQueries({ queryKey: permissionQueryKeys.userPermissions(variables.userId) });
    },
  });
};

export const useRemoveUserPermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeUserPermission,
    onSuccess: () => {
      // Invalidate user data to refetch updated permissions
      queryClient.invalidateQueries({ queryKey: ["users"] });
      // Invalidate all user permissions queries (we don't have userId here)
      queryClient.invalidateQueries({ queryKey: [...permissionQueryKeys.allPermissions, "user-permissions"] });
    },
  });
};

export const useUsersByPermission = (permissionId: string) => {
  return useQuery({
    queryKey: permissionQueryKeys.permissionUsers(permissionId),
    queryFn: () => getUsersByPermissionId(permissionId),
    enabled: !!permissionId,
  });
};

export const useUserPermissions = (userId: string) => {
  return useQuery({
    queryKey: permissionQueryKeys.userPermissions(userId),
    queryFn: () => getUserPermissions(userId),
    enabled: !!userId,
  });
};
