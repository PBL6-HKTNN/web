import type { UUID } from "@/types";
import type {
  CodemyRequest,
  CreateRequestReq,
  ResolveRequestReq,
  UpdateRequestReq,
} from "@/types/db/request";
import api from "@/utils/api";
import API_ROUTES from "@/conf/constants/api-routes";

class RequestService {
  /**
   * Get all requests (admin/staff only)
   */
  async getRequests() {
    const response = await api.get<CodemyRequest[]>(
      API_ROUTES.REQUEST.getRequests
    );
    return response.data;
  }

  /**
   * Get current user's requests
   */
  async getUserRequests() {
    const response = await api.get<CodemyRequest[]>(
      API_ROUTES.REQUEST.getUserRequest
    );
    return response.data;
  }

  /**
   * Get requests resolved by the current user (admin/staff only)
   */
  async getResolvedRequests() {
    const response = await api.get<CodemyRequest[]>(
      API_ROUTES.REQUEST.getResolvedRequests
    );
    return response.data;
  }

  /**
   * Get all available request types
   */
  async getRequestTypes() {
    const response = await api.get(API_ROUTES.REQUEST.getRequestTypes);
    return response.data;
  }

  /**
   * Get a specific request by ID
   */
  async getRequestById(requestId: UUID) {
    const response = await api.get<CodemyRequest>(
      API_ROUTES.REQUEST.getRequestById(requestId)
    );
    return response.data;
  }

  /**
   * Create a new request
   */
  async createRequest(data: CreateRequestReq) {
    const response = await api.post<CodemyRequest>(
      API_ROUTES.REQUEST.createRequest,
      data
    );
    return response.data;
  }

  /**
   * Update an existing request
   */
  async updateRequest(requestId: UUID, data: UpdateRequestReq) {
    const response = await api.put<CodemyRequest>(
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
  async resolveRequest(data: ResolveRequestReq) {
    const response = await api.put<CodemyRequest>(
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
