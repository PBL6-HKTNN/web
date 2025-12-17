import { createFileRoute } from '@tanstack/react-router'
import { useUsers } from '@/hooks/queries/user-hooks'
import { useMemo, useState } from 'react'
import { UserListing } from '@/components/admin/users/user-listing'

export const Route = createFileRoute('/admin/users/')({
  component: RouteComponent,
})

const ITEMS_PER_PAGE = 10;

function RouteComponent() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchTerm, _setSearchTerm] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [roleFilter, _setRoleFilter] = useState('all')

  // Build filter params for API
  const roleFilterMap = {
    'all': undefined,
    'student': 'student',
    'lecturer': 'instructor',
    'mod': 'moderator',
    'admin': 'admin'
  } as const

  const filterParams = useMemo(() => {
    const params: {
      Name?: string;
      Email?: string;
      Role?: string;
      PageSize?: number;
    } = {
      PageSize: ITEMS_PER_PAGE,
    };

    if (searchTerm) {
      if (searchTerm.includes('@')) {
        params.Email = searchTerm;
      } else {
        params.Name = searchTerm;
      }
    }

    if (roleFilter !== 'all') {
      params.Role = roleFilterMap[roleFilter as keyof typeof roleFilterMap];
    }

    return params;
  }, [searchTerm, roleFilter]);

  // API data with infinite query
  const {
    data,
    isLoading,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUsers(filterParams);

  // Flatten the infinite query data
  const users = useMemo(() => {
    return data?.pages.flatMap(page => page.data || []) || [];
  }, [data]);

  return (
    <UserListing
      users={users}
      isLoading={isLoading}
      error={error}
      isFetching={isFetching}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      onLoadMore={() => fetchNextPage()}
    />
  )
}