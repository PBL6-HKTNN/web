import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/order/$orderId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/order/$orderId"!</div>
}
