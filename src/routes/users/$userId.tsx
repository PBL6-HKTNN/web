import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { userService } from '@/services/userService';
import type { User } from '@/types';
import { UserRoute } from '@components/user/UserRoute';
import { authGuard } from '@/utils';

function UserDetailComponent() {
  const { loaderUser, userId } = useLoaderData({ from: Route.id });
  return <UserRoute loaderUser={loaderUser} userId={userId} />;
}

export const Route = createFileRoute('/users/$userId')({
  beforeLoad: authGuard,
  loader: async ({ params }) => {
    const user =
      (await userService.getUserById(params.userId)) ||
      ({
        id: '102220237',
        name: 'Dao Le Hanh Nguyen',
        bio: 'Frontend Developer',
        avatar: 'https://via.placeholder.com/150?text=Avatar',
        email: 'hanh.nguyen@example.com'
      } as User);
    return { loaderUser: user, userId: params.userId };
  },
  component: UserDetailComponent,
});
