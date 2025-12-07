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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RequestStatus } from "@/types/db/request";
import { useResponseForm } from "./hook";
import type { UUID } from "@/types";

interface ResponseFormProps {
  requestId: UUID;
  onSuccess?: () => void;
}

export function ResponseForm({ requestId, onSuccess }: ResponseFormProps) {
  const { form, onSubmit, isSubmitting } = useResponseForm(requestId);
  const status = form.watch("status");

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data);
    onSuccess?.();
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Decision</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a decision" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={String(RequestStatus.Approved)}>
                    Approve Request
                  </SelectItem>
                  <SelectItem value={String(RequestStatus.Rejected)}>
                    Reject Request
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="response"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {status === String(RequestStatus.Rejected)
                  ? "Reason for Rejection"
                  : "Response Message (Optional)"}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={
                    status === String(RequestStatus.Rejected)
                      ? "Please provide a reason for rejecting this request..."
                      : "Add any additional comments or notes..."
                  }
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
            type="submit"
            disabled={isSubmitting || !status}
            className={status === String(RequestStatus.Rejected) ? "bg-red-600 hover:bg-red-700" : ""}
          >
            {isSubmitting
              ? "Submitting..."
              : status === String(RequestStatus.Rejected)
                ? "Reject Request"
                : "Approve Request"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
