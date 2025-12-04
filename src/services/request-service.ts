import type { UUID } from "@/types";
import type {
  CreateRequestReq,
  RequestApiRes,
  RequestsApiRes,
  RequestTypesApiRes,
  ResolveRequestReq,
  UpdateRequestReq,
} from "@/types/db/request";
import api from "@/utils/api";
import API_ROUTES from "@/conf/constants/api-routes";

class RequestService {
  /**
   * Get all requests (admin/staff only)
   */
  async getRequests(): Promise<RequestsApiRes> {
    const response = await api.get<RequestsApiRes>(
      API_ROUTES.REQUEST.getRequests
    );
    return response.data;
  }

  /**
   * Get current user's requests
   */
  async getUserRequests(): Promise<RequestsApiRes> {
    const response = await api.get<RequestsApiRes>(
      API_ROUTES.REQUEST.getUserRequest
    );
    return response.data;
  }

  /**
   * Get requests resolved by the current user (admin/staff only)
   */
  async getResolvedRequests(): Promise<RequestsApiRes> {
    const response = await api.get<RequestsApiRes>(
      API_ROUTES.REQUEST.getResolvedRequests
    );
    return response.data;
  }

  /**
   * Get all available request types
   */
  async getRequestTypes(): Promise<RequestTypesApiRes> {
    const response = await api.get<RequestTypesApiRes>(
      API_ROUTES.REQUEST.getRequestTypes
    );
    return response.data;
  }

  /**
   * Get a specific request by ID
   */
  async getRequestById(requestId: UUID): Promise<RequestApiRes> {
    const response = await api.get<RequestApiRes>(
      API_ROUTES.REQUEST.getRequestById(requestId)
    );
    return response.data;
  }

  /**
   * Create a new request
   */
  async createRequest(data: CreateRequestReq): Promise<RequestApiRes> {
    const response = await api.post<RequestApiRes>(
      API_ROUTES.REQUEST.createRequest,
      data
    );
    return response.data;
  }

  /**
   * Update an existing request
   */
  async updateRequest(
    requestId: UUID,
    data: UpdateRequestReq
  ): Promise<RequestApiRes> {
    const response = await api.put<RequestApiRes>(
      API_ROUTES.REQUEST.updateRequest(requestId),
      data
    );
    return response.data;
  }

  /**
   * Delete a request
   */
  async deleteRequest(requestId: UUID) {
    const response = await api.delete(
      API_ROUTES.REQUEST.deleteRequest(requestId)
    );
    return response.data;
  }

  /**
   * Resolve a request (admin/staff only)
   */
  async resolveRequest(data: ResolveRequestReq): Promise<RequestApiRes> {
    const response = await api.put<RequestApiRes>(
      API_ROUTES.REQUEST.resolveRequest(data.requestId),
      {
        status: data.status,
        response: data.response,
      }
    );
    return response.data;
  }
}

export const requestService = new RequestService();
