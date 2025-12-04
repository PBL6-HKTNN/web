import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react'

interface CoursePublicCheckModalProps {
  isOpen: boolean
  isChecking: boolean
  isSubmitting: boolean
  checkResults: {
    hasModules: boolean
    hasLessons: boolean
    hasValidPrice: boolean
    hasThumbnail: boolean
    isPublishable: boolean
  } | null
  onClose: () => void
  onPerformCheck: () => void
  onSubmitPublication: () => void
}

export function CoursePublicCheckModal({
  isOpen,
  isChecking,
  isSubmitting,
  checkResults,
  onClose,
  onPerformCheck,
  onSubmitPublication,
}: CoursePublicCheckModalProps) {
  const checks = [
    { key: 'hasThumbnail', label: 'Course Thumbnail', description: 'A thumbnail image is required' },
    { key: 'hasModules', label: 'Course Modules', description: 'At least one module is required' },
    { key: 'hasLessons', label: 'Course Lessons', description: 'Each module must have at least one lesson' },
    { key: 'hasValidPrice', label: 'Valid Price', description: 'Course price must be set correctly' },
  ] as const

  const passedChecks = checkResults
    ? Object.entries(checkResults)
        .filter(([key]) => key !== 'isPublishable')
        .filter(([, value]) => value === true).length
    : 0

  const totalChecks = checks.length

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Publish Course to Public</DialogTitle>
          <DialogDescription>
            Verify that your course meets all requirements to be published publicly and available to learners.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Check Results or Initial State */}
          {!checkResults && !isChecking && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Course Publication Requirements</CardTitle>
                <CardDescription>
                  Your course must meet the following criteria to be published:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {checks.map((check) => (
                    <li key={check.key} className="flex gap-3">
                      <AlertCircle className="size-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">{check.label}</p>
                        <p className="text-sm text-muted-foreground">{check.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {isChecking && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Checking Course Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Verification Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {passedChecks}/{totalChecks}
                    </span>
                  </div>
                  <Progress value={(passedChecks / totalChecks) * 100} className="h-2" />
                </div>
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="size-8 text-primary animate-spin" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {checkResults && !isChecking && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Verification Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {checks.map((check) => {
                    const passed = checkResults[check.key as keyof typeof checkResults]
                    return (
                      <div key={check.key} className="flex items-start gap-3 p-3 rounded-lg border">
                        {passed ? (
                          <CheckCircle2 className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="size-5 text-destructive flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium">{check.label}</p>
                          <p className="text-sm text-muted-foreground">{check.description}</p>
                        </div>
                        <span className={`text-sm font-medium ${passed ? 'text-green-600' : 'text-destructive'}`}>
                          {passed ? 'Pass' : 'Fail'}
                        </span>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {checkResults.isPublishable ? (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Great! Your course meets all requirements and is ready to be published to learners.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="border-destructive/50 bg-destructive/5">
                  <XCircle className="h-4 w-4 text-destructive" />
                  <AlertDescription className="text-destructive">
                    Your course does not meet all requirements. Please fix the failing items and try again.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isChecking}>
            {checkResults ? 'Close' : 'Cancel'}
          </Button>

          {!checkResults ? (
            <Button onClick={onPerformCheck} disabled={isChecking}>
              {isChecking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                'Start Verification'
              )}
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={onPerformCheck} disabled={isChecking}>
                Re-check
              </Button>
              <Button 
                onClick={onSubmitPublication} 
                disabled={isSubmitting || !checkResults?.isPublishable}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Course Publication'
                )}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
