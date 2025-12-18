import api, { createApiService } from "@/utils/api";
import API_ROUTES from "@/conf/constants/api-routes";
import type {
  LoginReq,
  RegisterReq,
  LogoutRes,
  GoogleLoginReq,
  VerifyEmailReq,
  RequestResetPasswordReq,
  ResetPasswordReq,
  AuthRes,
  ChangePasswordReq,
} from "@/types/core/auth";
import type {
  ExchangeCodeForTokenReq,
  GetRefreshTokenResponse,
} from "@/types/db";
import { ggRedirectUri } from "@/conf";

const _authService = {
  async login(data: LoginReq): Promise<AuthRes> {
    const response = await api.post<AuthRes>(API_ROUTES.AUTH.login, data);
    return response.data;
  },

  async register(data: RegisterReq): Promise<AuthRes> {
    const response = await api.post<AuthRes>(API_ROUTES.AUTH.register, data);
    return response.data;
  },

  async logout(): Promise<LogoutRes> {
    const response = await api.post<LogoutRes>(API_ROUTES.AUTH.logout);
    return response.data;
  },

  async googleLogin(data: GoogleLoginReq): Promise<AuthRes> {
    const response = await api.post<AuthRes>(API_ROUTES.AUTH.googleLogin, data);
    return response.data;
  },

  async verifyEmail(data: VerifyEmailReq): Promise<AuthRes> {
    const response = await api.post<AuthRes>(API_ROUTES.AUTH.verifyEmail, data);
    return response.data;
  },

  async requestResetPassword(data: RequestResetPasswordReq): Promise<AuthRes> {
    const response = await api.post<AuthRes>(
      API_ROUTES.AUTH.requestResetPassword,
      data
    );
    return response.data;
  },

  async resetPassword(data: ResetPasswordReq): Promise<AuthRes> {
    const response = await api.post<AuthRes>(
      API_ROUTES.AUTH.resetPassword,
      data
    );
    return response.data;
  },

  async changePassword(data: ChangePasswordReq): Promise<AuthRes> {
    const response = await api.put<AuthRes>(
      API_ROUTES.AUTH.changePassword,
      data
    );
    return response.data;
  },

  async getRefreshToken(): Promise<GetRefreshTokenResponse> {
    const response = await api.get<GetRefreshTokenResponse>(
      API_ROUTES.AUTH.getRefreshToken,
      {
        params: {
          returnUrl: ggRedirectUri,
        },
      }
    );
    return response.data;
  },

  async exchangeCodeForToken(
    data: ExchangeCodeForTokenReq
  ): Promise<GetRefreshTokenResponse> {
    const response = await api.post<GetRefreshTokenResponse>(
      API_ROUTES.AUTH.exchangeCodeForToken,
      data
    );
    return response.data;
  },
};

// Export service with comprehensive error handling
export const authService = createApiService(_authService, "AuthService");
