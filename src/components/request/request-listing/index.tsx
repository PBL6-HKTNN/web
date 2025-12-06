import { useMemo, useState } from "react";
import { RequestCard } from "../request-card";
import { RequestDetailModal } from "../request-detail-modal";
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
import type { CodemyRequest, RequestTypeEnum } from "@/types/db/request";
import { RequestStatus } from "@/types/db/request";
import { format } from "date-fns";
import { STATUS_COLORS, STATUS_LABELS, REQUEST_TYPE_COLORS } from "../utils";
import { useGetRequestTypes } from "@/hooks/queries/request-hooks";
import {
  useRequestTypeFilter,
  useRequestListingFilters,
  useRequestDetailModal,
} from "./hooks";

interface RequestListingProps {
  requests: CodemyRequest[];
  isLoading?: boolean;
  onEdit?: (request: CodemyRequest) => void;
  viewMode?: "card" | "table";
  isModerator?: boolean;
  fixedRequestTypeFilter?: RequestTypeEnum | RequestTypeEnum[];
}

export function RequestListing({
  requests,
  isLoading,
  onEdit,
  viewMode = "table",
  isModerator = false,
  fixedRequestTypeFilter,
}: RequestListingProps) {
  const { data: requestTypesRes } = useGetRequestTypes();
  const requestTypes = useMemo(() => requestTypesRes?.data || [], [requestTypesRes?.data]);

  const [selectedTypeId, setSelectedTypeId] = useState<string | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<number | "all">("all");

  const { applyFixedFilter } = useRequestTypeFilter(requestTypes);

  const applyFixedFilterCallback = useMemo(
    () => (reqs: CodemyRequest[]) => applyFixedFilter(reqs, fixedRequestTypeFilter),
    [applyFixedFilter, fixedRequestTypeFilter]
  );

  const filteredRequests = useRequestListingFilters(
    requests,
    selectedTypeId,
    selectedStatus,
    applyFixedFilterCallback
  );

  const hasFilters = selectedTypeId !== "all" || selectedStatus !== "all";

  const {
    selectedRequestId,
    isDetailModalOpen,
    handleViewRequest,
    handleCloseModal,
  } = useRequestDetailModal();

  // Get the selected request for detail modal
  const selectedRequest = selectedRequestId
    ? requests.find((r) => r.id === selectedRequestId)
    : undefined;

  // Get available request types for filter (excluding fixed filter types)
  const availableRequestTypes = fixedRequestTypeFilter
    ? requestTypes.filter((type) => {
        const enums = Array.isArray(fixedRequestTypeFilter)
          ? fixedRequestTypeFilter
          : [fixedRequestTypeFilter];
        return !enums.includes(type.type as RequestTypeEnum);
      })
    : requestTypes;

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
      {/* Filters - Only show if not fixed */}
      {!fixedRequestTypeFilter && (
        <div className="bg-white p-4 rounded-lg border space-y-4">
          <h3 className="font-semibold text-sm">Filter</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Request Type Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Request Type</label>
              <Select
                value={String(selectedTypeId)}
                onValueChange={(value) =>
                  setSelectedTypeId(value === "all" ? "all" : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {availableRequestTypes.map((type) => (
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
      )}

      {/* Results Info */}
      <div className="text-sm text-gray-600">
        Showing {filteredRequests.length} of {requests.length} request
        {requests.length !== 1 ? "s" : ""}
      </div>

      {filteredRequests.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {fixedRequestTypeFilter
            ? "No requests of this type."
            : "No requests match the selected filters."}
        </div>
      ) : viewMode === "card" ? (
        // Card View
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              onClick={() =>
                isModerator && handleViewRequest(request.id)
              }
              className={isModerator ? "cursor-pointer" : ""}
            >
              <RequestCard
                request={request}
                onEdit={onEdit}
              />
            </div>
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
                {isModerator && <TableHead className="w-20">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow
                  key={request.id}
                  onClick={() =>
                    isModerator && handleViewRequest(request.id)
                  }
                  className={
                    isModerator ? "cursor-pointer hover:bg-gray-50" : ""
                  }
                >
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
                  {isModerator && (
                    <TableCell>
                      {request.status === RequestStatus.Reviewing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewRequest(request.id);
                          }}
                        >
                          Review
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Request Detail Modal */}
      {isModerator && (
        <RequestDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseModal}
          request={selectedRequest}
          isLoading={false}
        />
      )}
    </div>
  );
}
