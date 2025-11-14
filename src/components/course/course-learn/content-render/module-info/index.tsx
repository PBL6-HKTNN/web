import { useGetModuleById, useGetLessonsByModule } from '@/hooks/queries/course/module-hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { BookOpen, Clock, Play, Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useNavigate } from '@tanstack/react-router'

interface ModuleInfoProps {
  moduleId: string
}

export function ModuleInfo({ moduleId }: ModuleInfoProps) {
  const navigate = useNavigate()
  
  const { 
    data: moduleData, 
    isLoading: moduleLoading, 
    error: moduleError 
  } = useGetModuleById(moduleId)
  
  const { 
    data: lessonsData, 
    isLoading: lessonsLoading, 
    error: lessonsError 
  } = useGetLessonsByModule(moduleId)

  const module = moduleData?.data
  const lessons = lessonsData?.data || []

  if (moduleLoading || lessonsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading module...</p>
        </div>
      </div>
    )
  }

  if (moduleError || lessonsError || !module) {
    return (
      <div className="flex items-center justify-center min-h-[400px] px-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Module Not Found</h2>
            <p className="text-muted-foreground text-sm">
              The module you're looking for doesn't exist or you don't have access to it.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 lg:px-8 lg:py-8 max-w-4xl">
      {/* Module Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{module.title}</CardTitle>
              <p className="text-muted-foreground mb-4">
                Module {module.order} - {module.numberOfLessons} lessons available
              </p>
            </div>
            <Badge variant="secondary">Module {module.order}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{lessons.length} Lessons</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                {module.duration ? `${module.duration} minutes` : 'Duration varies'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Module Lessons */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            Lessons in this Module
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lessons.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No lessons are available in this module yet.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              {lessons.map((lesson, index) => (
                <div key={lesson.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-primary">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{lesson.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Lesson {lesson.orderIndex} • {lesson.lessonType === 0 ? 'Markdown' : lesson.lessonType === 1 ? 'Video' : 'Quiz'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {lesson.duration && (
                      <Badge variant="outline" className="text-xs">
                        {lesson.duration} min
                      </Badge>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        navigate({
                          to: '/learn/$courseId/$moduleId/$lessonId',
                          params: {
                            courseId: module.courseId,
                            moduleId: moduleId,
                            lessonId: lesson.id
                          }
                        })
                      }}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Start
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Module Progress or Next Steps */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Ready to Start Learning?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Begin with the first lesson in this module or continue from where you left off.
          </p>
          <Separator className="mb-4" />
          {lessons.length > 0 && (
            <Button 
              onClick={() => {
                navigate({
                  to: '/learn/$courseId/$moduleId/$lessonId',
                  params: {
                    courseId: module.courseId,
                    moduleId: moduleId,
                    lessonId: lessons[0].id
                  }
                })
              }}
            >
              <Play className="w-4 h-4 mr-2" />
              Start First Lesson
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ModuleInfo
