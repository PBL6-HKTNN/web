import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            About CodeMy
          </div>
          <h1 className="block mt-1 text-lg leading-tight font-medium text-black">
            About Page
          </h1>
          <p className="mt-2 text-gray-500">
            This is the about page. TanStack Router uses file-based routing, so this page is defined in /routes/about.tsx.
          </p>
          <div className="mt-4">
            <Link
              to="/"
              className="inline-block bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Back to Home
            </Link>
            <Link
              to="/contact"
              className="inline-block bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            >
              Go to Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}