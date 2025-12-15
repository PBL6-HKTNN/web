import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, X, Calendar } from "lucide-react";
import { useExchangeCodeForToken } from "@/hooks/queries/auth-hooks";
import z from "zod";

const searchParamsSchema = z.object({
  code: z.string().optional(),
});

type CodeSearchParams = z.infer<typeof searchParamsSchema>;

export const Route = createFileRoute("/__provider/google/callback")({
  component: RouteComponent,
  validateSearch: searchParamsSchema,
  beforeLoad: ({ search }): CodeSearchParams => {
    // Check if code exists in search params
    return {
      code: (search as CodeSearchParams)?.code || undefined,
    };
  },
});

function RouteComponent() {
  const { code } = Route.useSearch();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  const exchangeCodeMutation = useExchangeCodeForToken();

  useEffect(() => {
    if (code) {
      exchangeCodeMutation.mutate(
        { code },
        {
          onSuccess: (response) => {
            if (response.isSuccess) {
              setStatus("success");
            } else {
              setStatus("error");
              setErrorMessage("Failed to connect Google account");
            }
          },
          onError: (error: { message?: string }) => {
            setStatus("error");
            setErrorMessage(
              error?.message || "An error occurred while connecting to Google"
            );
          },
        }
      );
    } else {
      setStatus("error");
      setErrorMessage("No authorization code found");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const handleCloseWindow = () => {
    window.close();
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-center">
              <Loader2 className="h-5 w-5 animate-spin" />
              Connecting to Google Calendar
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Please wait while we connect your Google Calendar account...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-center text-green-600">
              <CheckCircle className="h-5 w-5" />
              Successfully Connected!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Google Calendar is now connected</span>
            </div>
            <p className="text-sm text-muted-foreground">
              You can now add courses to your Google Calendar. You may close
              this window and try adding to calendar again.
            </p>
            <Button onClick={handleCloseWindow} className="w-full">
              Close Window
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-center text-red-600">
            <X className="h-5 w-5" />
            Connection Failed
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">{errorMessage}</p>
          <p className="text-sm text-muted-foreground">
            Please close this window and try again.
          </p>
          <Button
            onClick={handleCloseWindow}
            variant="outline"
            className="w-full"
          >
            Close Window
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
