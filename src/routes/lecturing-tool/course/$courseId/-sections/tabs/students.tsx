// JSX runtime handles React import automatically
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetCourseEnrolledStudents,
  useGetLastDateCourse,
} from "@/hooks/queries/course/enrollment-hooks";
import { formatDate } from "@/utils/format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface StudentsTabProps {
  courseId: string;
}

export default function StudentsTab({ courseId }: StudentsTabProps) {
  const {
    data: studentsData,
    isLoading: studentsLoading,
    error: studentsError,
  } = useGetCourseEnrolledStudents(courseId);
  const { data: lastDateData, isLoading: lastDateLoading } =
    useGetLastDateCourse(courseId);

  const students = studentsData?.data?.students || [];
  const lastDate = lastDateData?.data || null;

  if (studentsLoading || lastDateLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (studentsError) {
    return (
      <div className="p-6 text-center">
        <p className="text-destructive">Failed to load enrolled students.</p>
      </div>
    );
  }

  return (
    <>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Enrolled Students</CardTitle>
            <CardDescription>
              Manage and view students enrolled in this course
            </CardDescription>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search students..."
              className="pl-8"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4 text-sm text-muted-foreground">
          <div>
            Total Students:{" "}
            <span className="font-medium text-foreground">
              {students.length}
            </span>
          </div>
          {lastDate && (
            <div>
              Last enrollment:{" "}
              <span className="font-medium text-foreground">
                {formatDate(lastDate)}
              </span>
            </div>
          )}
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Enrolled Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No students enrolled yet.
                  </TableCell>
                </TableRow>
              ) : (
                students.map((studentName, idx) => (
                  <TableRow key={`${studentName}-${idx}`}>
                    <TableCell>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {studentName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{studentName}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {/* Mock date for now as API only returns names */}
                      {formatDate(new Date().toISOString())}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </>
  );
}
