import { createFileRoute } from '@tanstack/react-router'
import { usePermissions } from '@/hooks/queries/permission-hooks'
import { PermissionListing } from '@/components/admin/permissions/permission-listing'

export const Route = createFileRoute('/admin/permissions/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: permissions = [], isLoading } = usePermissions()

  return <PermissionListing permissions={permissions} isLoading={isLoading} />
}