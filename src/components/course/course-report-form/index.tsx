import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Flag } from "lucide-react";
import { useCourseReportForm } from "./hook";
import type { UUID } from "@/types";
import type { Course } from "@/types/db/course";

interface CourseReportFormProps {
  courseId: UUID;
  course?: Course;
  trigger?: React.ReactNode;
}

export function CourseReportForm({ courseId, course, trigger }: CourseReportFormProps) {
  const { open, setOpen, form, onSubmit, isSubmitting, reportCourseType } = useCourseReportForm(courseId);

  const defaultTrigger = (
    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500">
      <Flag className="w-4 h-4 mr-1" />
      Report
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report Course</DialogTitle>
          <DialogDescription>
            Report this course "{course?.title || 'Unknown Course'}" for inappropriate content.
            Your report will be reviewed by our moderators.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for report</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please describe why you're reporting this course..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !reportCourseType}
              >
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
