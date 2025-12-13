import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { useGetRequestTypes, useCreateRequest } from "@/hooks/queries/request-hooks";
import { RequestTypeEnum } from "@/types/db/request";
import type { Review } from "@/types/db/review";

const reportSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type ReportFormData = z.infer<typeof reportSchema>;

interface ReviewReportFormProps {
  review: Review & {
    user?: {
      name: string;
      profilePicture?: string;
    };
  };
  trigger?: React.ReactNode;
}

export function ReviewReportForm({ review, trigger }: ReviewReportFormProps) {
  const [open, setOpen] = useState(false);
  const { data: requestTypesRes } = useGetRequestTypes();
  const createRequest = useCreateRequest();

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      description: "",
    },
  });

  // Find the REPORT_A_REVIEW request type
  const reportReviewType = requestTypesRes?.data?.find(
    (type) => type.type === RequestTypeEnum.REPORT_A_REVIEW
  );

  const onSubmit = (data: ReportFormData) => {
    if (!reportReviewType) {
      console.error("Report review type not found");
      return;
    }

    createRequest.mutate(
      {
        requestTypeId: reportReviewType.id,
        description: data.description,
        // Note: We might need to add userId to the request if the backend expects it
        // For now, assuming the backend gets the reporter from auth context
      },
      {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
      }
    );
  };

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
          <DialogTitle>Report Review</DialogTitle>
          <DialogDescription>
            Report this review by {review.user?.name || "Anonymous"} for inappropriate content.
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
                      placeholder="Please describe why you're reporting this review..."
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
                disabled={createRequest.isPending || !reportReviewType}
              >
                {createRequest.isPending ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
