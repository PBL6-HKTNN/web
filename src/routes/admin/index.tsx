import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
})

function RouteComponent() {

  return (
    <div className="p-6 space-y-6 ">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>
    </div>

    )
  
}
