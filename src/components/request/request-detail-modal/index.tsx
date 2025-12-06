import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponseForm } from "./response-form";
import { REQUEST_TYPE_COLORS, REQUEST_TYPE_LABELS, STATUS_COLORS, STATUS_LABELS } from "../utils";
import { useGetRequestTypes } from "@/hooks/queries/request-hooks";
import type { CodemyRequest } from "@/types/db/request";
import { formatDate } from "@/utils/format";
import { cn } from "@/lib/utils";

interface RequestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  request?: CodemyRequest;
  isLoading?: boolean;
}

export function RequestDetailModal({
  isOpen,
  onClose,
  request,
  isLoading,
}: RequestDetailModalProps) {
  const { data: requestTypesRes } = useGetRequestTypes();
  const requestTypes = requestTypesRes?.data || [];

  const getRequestTypeName = () => {
    if (!request) return "Request";
    const requestType = requestTypes.find((type) => type.id === request.requestTypeId);
    if (!requestType) return "Unknown";
    return REQUEST_TYPE_LABELS[requestType.type] || "Request";
  };

  const getRequestTypeColor = () => {
    if (!request) return "bg-gray-100 text-gray-800 border-gray-200";
    const requestType = requestTypes.find((type) => type.id === request.requestTypeId);
    if (!requestType) return "bg-gray-100 text-gray-800 border-gray-200";
    return REQUEST_TYPE_COLORS[requestType.type] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request Details</DialogTitle>
          <DialogDescription>
            Review and respond to the request
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : request ? (
          <div className="space-y-6">
            {/* Request Info Card */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">
                      Request Information
                    </CardTitle>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        className={cn(
                            getRequestTypeColor(),
                            "text-xs border"
                        )}
                      >
                        {getRequestTypeName()}
                      </Badge>
                      <Badge className={STATUS_COLORS[request.status]}>
                        {STATUS_LABELS[request.status]}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Description
                  </p>
                  <p className="text-sm text-gray-700">{request.description}</p>
                </div>

                {request.courseId && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Course ID
                    </p>
                    <p className="text-sm text-gray-700 font-mono">
                      {request.courseId}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Submitted By
                  </p>
                  <p className="text-sm text-gray-700 font-mono">
                    {request.userId}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Created Date
                  </p>
                  <p className="text-sm text-gray-700">
                    {formatDate(request.createdAt as string)}
                  </p>
                </div>

                {request.response && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Response
                    </p>
                    <p className="text-sm text-gray-700">{request.response}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Response Form - Only show if request is still reviewing */}
            {request.status === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Respond to Request</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponseForm
                    requestId={request.id}
                    onSuccess={onClose}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Request not found
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
