import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useUser } from '@/hooks/queries/user-hooks'
import { Link } from '@tanstack/react-router'
import { Star } from 'lucide-react'
import type { User } from '@/types/db'

interface InstructorProps {
  instructorId?: string
}

export default function InstructorTab({ instructorId }: InstructorProps) {
  const { data, isLoading, error } = useUser(instructorId as string)

  if (!instructorId) {
    return null
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent>
          <div className="text-muted-foreground">Unable to load instructor information</div>
        </CardContent>
      </Card>
    )
  }

  const instructor = data.data!.user as User

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Instructor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-6">
          <Avatar className="w-20 h-20">
            <AvatarImage src={instructor.profilePicture || undefined} />
            <AvatarFallback>{instructor.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{instructor.name}</h3>
                <div className="text-sm text-muted-foreground">{instructor.email}</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Instructor</Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{(instructor.rating ?? 0).toFixed(1)}</span>
                </div>
              </div>
            </div>
            {instructor.bio && (
              <p className="text-sm text-muted-foreground mt-2">{instructor.bio}</p>
            )}
            <div className="mt-4">
              <Button asChild size="sm">
                  <Link to="/users/$userId" params={{ userId: instructor.id }}>View Profile</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
