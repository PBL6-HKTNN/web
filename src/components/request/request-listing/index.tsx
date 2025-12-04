import { useMemo, useState } from "react";
import { RequestCard } from "../request-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import type { CodemyRequest } from "@/types/db/request";
import { RequestStatus } from "@/types/db/request";
import { STATUS_COLORS, STATUS_LABELS, REQUEST_TYPE_COLORS } from "../utils";
import { useGetRequestTypes } from "@/hooks/queries/request-hooks";

interface RequestListingProps {
  requests: CodemyRequest[];
  isLoading?: boolean;
  onEdit?: (request: CodemyRequest) => void;
  viewMode?: "card" | "table";
}

export function RequestListing({
  requests,
  isLoading,
  onEdit,
  viewMode = "table",
}: RequestListingProps) {
  const { data: requestTypesRes } = useGetRequestTypes();
  const requestTypes = requestTypesRes?.data || [];
  
  const [selectedTypeId, setSelectedTypeId] = useState<string | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<number | "all">("all");

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const typeMatch =
        selectedTypeId === "all" || request.requestTypeId === selectedTypeId;
      const statusMatch = selectedStatus === "all" || request.status === selectedStatus;
      return typeMatch && statusMatch;
    });
  }, [requests, selectedTypeId, selectedStatus]);

  const hasFilters = selectedTypeId !== "all" || selectedStatus !== "all";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Loading requests...</div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-12">
        <div className="text-gray-500 text-lg mb-2">No requests yet</div>
        <p className="text-sm text-gray-400">
          You haven't submitted any requests. Create one to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border space-y-4">
        <h3 className="font-semibold text-sm">Filter</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Request Type Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Request Type</label>
            <Select
              value={String(selectedTypeId)}
              onValueChange={(value) => setSelectedTypeId(value === "all" ? "all" : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {requestTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={String(selectedStatus)}
              onValueChange={(value) =>
                setSelectedStatus(value === "all" ? "all" : parseInt(value))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value={String(RequestStatus.Reviewing)}>
                  Reviewing
                </SelectItem>
                <SelectItem value={String(RequestStatus.Approved)}>
                  Approved
                </SelectItem>
                <SelectItem value={String(RequestStatus.Rejected)}>
                  Rejected
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedTypeId("all");
              setSelectedStatus("all");
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Results Info */}
      <div className="text-sm text-gray-600">
        Showing {filteredRequests.length} of {requests.length} request
        {requests.length !== 1 ? "s" : ""}
      </div>

      {filteredRequests.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No requests match the selected filters.
        </div>
      ) : viewMode === "card" ? (
        // Card View
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onEdit={onEdit}
            />
          ))}
        </div>
      ) : (
        // Table View
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    <Badge 
                      className={`${REQUEST_TYPE_COLORS[requestTypes.find((type) => type.id === request.requestTypeId)?.type || -1] || "bg-gray-100 text-gray-800 border-gray-200"} text-xs border`}
                    >
                      {requestTypes.find((type) => type.id === request.requestTypeId)
                        ?.description || "Unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {request.description}
                  </TableCell>
                  <TableCell>
                    <Badge className={STATUS_COLORS[request.status]}>
                      {STATUS_LABELS[request.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {format(new Date(request.createdAt || Date.now()), "PPP")}
                  </TableCell>
                  <TableCell>
                    {request.status === RequestStatus.Reviewing && onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(request)}
                      >
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
