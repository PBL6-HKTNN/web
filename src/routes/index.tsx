import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Code,
  Zap,
  Users,
  BookOpen,
  Star,
  ArrowRight,
  CheckCircle,
  Github,
  Twitter,
  Mail,
} from 'lucide-react'
import { NavBar } from '@/components/layout'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <NavBar />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 dark:bg-slate-800 dark:text-slate-300">
              🚀 Now in Beta
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Master Programming with
              <span className="text-indigo-600 dark:text-indigo-400 block">Interactive Learning</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              CodeMy is your ultimate platform for learning programming through hands-on projects,
              interactive tutorials, and real-world applications. Start your coding journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Learning Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3 dark:border-slate-700 dark:text-slate-300">
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Hero Image/Illustration */}
          <div className="mt-16 relative">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 rounded-2xl p-8 text-white">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Interactive Code Editor</h3>
                  <p className="text-indigo-100 mb-6">
                    Write, run, and debug code directly in your browser with our powerful
                    integrated development environment.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      JavaScript
                    </Badge>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      Python
                    </Badge>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      React
                    </Badge>
                  </div>
                </div>
                <div className="bg-slate-900 dark:bg-slate-800 rounded-lg p-4 font-mono text-sm">
                  <div className="text-green-400 mb-2">// Welcome to CodeMy</div>
                  <div className="text-blue-400">function</div> <span className="text-yellow-400">greetUser</span>() {'{'}
                  <div className="ml-4 text-gray-300">
                    console.log("Hello, Developer!");
                  </div>
                  {'}'}
                  <div className="mt-2 text-green-400">// Start coding now!</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Announcement Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-amber-50 dark:bg-amber-950/20">
        <div className="max-w-4xl mx-auto">
          <Alert className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50">
            <Star className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              <strong>🎉 New Feature:</strong> We've just launched our AI-powered code review assistant! Get instant feedback on your code quality and best practices.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose CodeMy?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to become a proficient programmer in one comprehensive platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <CardTitle className="dark:text-white">Interactive Tutorials</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Learn through hands-on coding exercises with instant feedback and detailed explanations.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="dark:text-white">Real-time Execution</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Write and run code instantly in your browser with our powerful code execution engine.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="dark:text-white">Community Support</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Join thousands of developers learning together. Get help, share projects, and grow your network.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="dark:text-white">Project-Based Learning</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Build real-world applications and add them to your portfolio while learning new technologies.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="dark:text-white">Progress Tracking</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Monitor your learning journey with detailed analytics and personalized learning paths.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/50 rounded-lg flex items-center justify-center mb-4">
                  <Code className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                </div>
                <CardTitle className="dark:text-white">Modern Technologies</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Stay up-to-date with the latest frameworks, tools, and best practices in software development.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Students Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join thousands of developers who have transformed their careers with CodeMy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="dark:bg-slate-700 dark:border-slate-600">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400">SJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Sarah Johnson</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Full Stack Developer</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">
                  "CodeMy completely changed how I learn programming. The interactive tutorials and real-time feedback helped me land my dream job in just 6 months!"
                </p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-slate-700 dark:border-slate-600">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarFallback className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400">MC</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Mike Chen</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Data Scientist</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">
                  "The project-based learning approach is incredible. I built a complete ML application and now I have a portfolio that actually impresses employers."
                </p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-slate-700 dark:border-slate-600">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarFallback className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400">AR</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Alex Rodriguez</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Frontend Developer</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">
                  "From zero to React expert in 4 months. The community support and mentorship program made all the difference in my learning journey."
                </p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-indigo-600 dark:bg-indigo-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Coding Journey?
          </h2>
          <p className="text-xl text-indigo-100 dark:text-indigo-200 mb-8">
            Join thousands of developers who are already learning and building amazing projects with CodeMy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-indigo-600 dark:hover:text-indigo-700">
              View Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Code className="h-8 w-8 text-indigo-400" />
                <span className="text-2xl font-bold">CodeMy</span>
              </div>
              <p className="text-gray-400 dark:text-gray-500">
                Empowering developers through interactive learning and hands-on coding experiences.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400 dark:text-gray-500">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400 dark:text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors">
                  <Github className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors">
                  <Mail className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-8 text-center text-gray-400 dark:text-gray-500">
            <p>&copy; 2025 CodeMy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}