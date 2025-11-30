import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/mod/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Moderator Dashboard</h1>
      </div>
    </div>
  )
}
