import { Button } from '@/components/ui/button'
import { authGuard } from '@/utils'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/lecturing-tool/course/$courseId/')({
  component: RouteComponent,
  beforeLoad: authGuard,
})

function RouteComponent() {
  const { courseId } = Route.useParams()
  return (
    <div>
      Hello "/lecturing-tool/course/{courseId}/"! <br />
      <Button>
        <Link to="/lecturing-tool/course/$courseId/editing"
          params={{
            courseId: courseId,
          }}
        >
          Edit Course
        </Link>
      </Button>
    </div>
  )
}
