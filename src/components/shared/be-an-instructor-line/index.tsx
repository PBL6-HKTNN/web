import { Link } from '@tanstack/react-router'
import { GraduationCap, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function BeAnInstructorLine() {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-3">
            <GraduationCap className="h-5 w-5" />
            <span className="text-sm font-medium">
              Share your knowledge and become an instructor
            </span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="bg-white text-indigo-600 hover:bg-gray-50 border-0"
            asChild
          >
            <Link to="/be-an-instructor" className="flex items-center space-x-2">
              <span>Be an Instructor</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}