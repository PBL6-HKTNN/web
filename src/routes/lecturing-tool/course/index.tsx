import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/lecturing-tool/course/')({
  component: RouteComponent,
})

function RouteComponent() {
  const toast = useToast()
  return <>
    <div>Hello "/lecturing-tool/course/"!</div>
    <Button 
      variant="outline"
      onClick={() => toast.success('hello world')}
    >Click me</Button>
  </>
}
