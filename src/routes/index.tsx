import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            Welcome to CodeMy
          </div>
          <h1 className="block mt-1 text-lg leading-tight font-medium text-black">
            TanStack Router Setup Complete!
          </h1>
          <p className="mt-2 text-gray-500">
            Your file-based routing is now configured. You can create new routes by adding files to the routes folder.
          </p>
          <div className="mt-4">
            <Link
              to="/about"
              className="inline-block bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            >
              Go to About
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}