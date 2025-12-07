import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ApplyForInstructorComponent } from '@/components/user/apply-for-instructor'
import { GraduationCap, Users, BookOpen, Award } from 'lucide-react'
import { NavBar } from '@/components/layout'
import Footer from '@/components/layout/footer'

export const Route = createFileRoute('/be-an-instructor/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <NavBar />
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
              <GraduationCap className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Become an Instructor
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Share your knowledge and expertise with thousands of learners worldwide.
            Join our community of expert instructors and make a difference in education.
          </p>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="text-lg px-8 py-4 h-auto">
                Apply to Become an Instructor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Join Our Instructor Community</DialogTitle>
                <DialogDescription>
                  Fill out the application form below to start your journey as an instructor.
                </DialogDescription>
              </DialogHeader>
              <ApplyForInstructorComponent />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Why Teach With Us?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Join thousands of instructors who are already making an impact
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Reach Millions
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Teach students from around the world and build your global audience
            </p>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <BookOpen className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Flexible Teaching
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Create courses on your schedule with our easy-to-use platform
            </p>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <Award className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Earn Revenue
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get paid for your expertise and build passive income streams
            </p>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                <GraduationCap className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Professional Growth
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Enhance your skills and establish yourself as an industry expert
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600 dark:bg-indigo-800">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Teaching?
            </h2>
            <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join our community of instructors and start sharing your knowledge today.
              The application process is simple and takes just a few minutes.
            </p>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8 py-4 h-auto bg-white text-indigo-600 hover:bg-gray-50"
                >
                  Apply Now
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Join Our Instructor Community</DialogTitle>
                  <DialogDescription>
                    Fill out the application form below to start your journey as an instructor.
                  </DialogDescription>
                </DialogHeader>
                <ApplyForInstructorComponent />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
