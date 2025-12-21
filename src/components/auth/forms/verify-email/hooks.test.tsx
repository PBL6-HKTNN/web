import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useVerifyEmailForm } from "./hooks";
import * as authHook from "@/hooks/queries/auth-hooks";

// --- Router mock ---
const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
}));

// --- Toast mock ---
const mockSuccess = vi.fn();
const mockError = vi.fn();
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    success: mockSuccess,
    error: mockError,
    info: vi.fn(),
    warning: vi.fn(),
  }),
}));

// --- Mutation mock factory ---
function createMutationMock(resolve?: any, reject?: any) {
  return {
    mutateAsync: vi.fn().mockImplementation(() => {
      if (reject) return Promise.reject(reject);
      return Promise.resolve(resolve);
    }),
    mutate: vi.fn(),
    data: undefined,
    error: null,
    isError: false,
    isIdle: false,
    isPending: false,
    isSuccess: false,
    reset: vi.fn(),
    failureCount: 0,
    failureReason: null,
    status: "idle",
  } as any; // Type assertion for simplicity
}

describe("useVerifyEmailForm", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={new QueryClient()}>
      {children}
    </QueryClientProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  it("updateField updates formData", () => {
    // Mock verify email mutation
    vi.spyOn(authHook, "useVerifyEmail").mockReturnValue(createMutationMock());

    const { result } = renderHook(
      () => useVerifyEmailForm("test@gmail.com", ""),
      { wrapper }
    );

    act(() => {
      result.current.updateField("token", "123456");
    });

    expect(result.current.formData.token).toBe("123456");
  });

  it("handleSubmit calls mutation and navigates when valid", async () => {
    const mockResponse = { status: 200, isSuccess: true };

    const mockMutation = createMutationMock(mockResponse);

    // Mock hook
    vi.spyOn(authHook, "useVerifyEmail").mockReturnValue(mockMutation);

    const { result } = renderHook(
      () => useVerifyEmailForm("test@gmail.com", "123456"),
      { wrapper }
    );

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any);
      vi.runAllTimers();
    });

    expect(mockMutation.mutateAsync).toHaveBeenCalledWith({
      email: "test@gmail.com",
      token: "123456",
    });

    expect(mockSuccess).toHaveBeenCalledWith("Email verified successfully!");
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/auth/login" });
  });

  it("handleSubmit shows error toast when API fails", async () => {
    const mockErrorObj = new Error(
      "Verification failed. Please check your token and try again."
    );

    const mockMutation = createMutationMock(undefined, mockErrorObj);

    vi.spyOn(authHook, "useVerifyEmail").mockReturnValue(mockMutation);

    const { result } = renderHook(
      () => useVerifyEmailForm("test@gmail.com", "123456"),
      { wrapper }
    );

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any);
    });

    expect(mockError).toHaveBeenCalledWith(
      "Verification failed. Please check your token and try again."
    );
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
