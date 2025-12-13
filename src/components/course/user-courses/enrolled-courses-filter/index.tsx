import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { EnrollmentProgressStatus, EnrollmentStatus } from '@/types/db/course/enrollment'

interface EnrolledCoursesFilterProps {
  filters?: import('@/types/db/course/enrollment').GetEnrolledCourseFilterReq
  onChange: (next?: import('@/types/db/course/enrollment').GetEnrolledCourseFilterReq) => void
}

export function EnrolledCoursesFilter({ filters, onChange }: EnrolledCoursesFilterProps) {
  const onProgressChange = (v: string) => {
    if (!v) return onChange(undefined)
    onChange({ ...filters, ProgressStatus: v === 'all' ? undefined : (Number(v) as unknown as EnrollmentProgressStatus) })
  }

  const onEnrollmentChange = (v: string) => {
    if (!v) return onChange(undefined)
    onChange({ ...filters, EnrollmentStatus: v === 'all' ? undefined : (Number(v) as unknown as EnrollmentStatus) })
  }

  const reset = () => onChange(undefined)

  return (
    <div className="flex items-center gap-4">
      <div className="space-y-1">
        <Label className="text-sm">Progress</Label>
        <Select value={filters?.ProgressStatus?.toString() || 'all'} onValueChange={(v) => onProgressChange(v)}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value={String(EnrollmentProgressStatus.NOT_STARTED)}>Not started</SelectItem>
            <SelectItem value={String(EnrollmentProgressStatus.IN_PROGRESS)}>In progress</SelectItem>
            <SelectItem value={String(EnrollmentProgressStatus.COMPLETED)}>Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label className="text-sm">Enrollment</Label>
        <Select value={filters?.EnrollmentStatus?.toString() || 'all'} onValueChange={(v) => onEnrollmentChange(v)}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value={String(EnrollmentStatus.ACTIVE)}>Active</SelectItem>
            <SelectItem value={String(EnrollmentStatus.COMPLETED)}>Completed</SelectItem>
            <SelectItem value={String(EnrollmentStatus.CANCELLED)}>Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Button variant="outline" onClick={reset}>Reset</Button>
      </div>
    </div>
  )
}
