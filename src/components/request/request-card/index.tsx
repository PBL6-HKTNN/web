import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CodemyRequest } from "@/types/db/request";
import { RequestStatus } from "@/types/db/request";
import { format } from "date-fns";
import { STATUS_COLORS, STATUS_LABELS, REQUEST_TYPE_COLORS } from "../utils";
import { useGetRequestTypes } from "@/hooks/queries/request-hooks";

interface RequestCardProps {
  request: CodemyRequest;
  onEdit?: (request: CodemyRequest) => void;
}

export function RequestCard({ request, onEdit }: RequestCardProps) {
  const { data: requestTypesRes } = useGetRequestTypes();
  const requestTypes = requestTypesRes?.data || [];
  
  const REQUEST_TYPE_LABELS: Record<number, string> = {
    0: "Instructor Role",
    1: "Public Course",
    2: "Hide Course",
    3: "Report Course",
    4: "Report Review",
  };
  
  const requestTypeEnum = requestTypes.find((type) => type.id === request.requestTypeId)?.type || -1;
  const requestTypeName = REQUEST_TYPE_LABELS[requestTypeEnum] || "Request";
  const requestTypeColor = REQUEST_TYPE_COLORS[requestTypeEnum] || "bg-gray-100 text-gray-800 border-gray-200";

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`${requestTypeColor} text-xs border`}>
                {requestTypeName}
              </Badge>
            </div>
            <CardDescription className="mt-1 text-sm text-muted-foreground">
              {format(new Date(request.createdAt || Date.now()), "PPP")}
            </CardDescription>
          </div>
          <Badge className={STATUS_COLORS[request.status]}>
            {STATUS_LABELS[request.status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Description</h4>
          <p className="text-sm text-gray-700 dark:text-gray-200 line-clamp-3">{request.description}</p>
        </div>

        {request.response && (
          <div className="space-y-2 border-t pt-4">
            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Response</h4>
            <p className="text-sm text-gray-700 dark:text-gray-200">{request.response}</p>
          </div>
        )}

        {request.status === RequestStatus.Reviewing && onEdit && (
          <div className="border-t pt-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => onEdit(request)}
            >
              Edit Request
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
