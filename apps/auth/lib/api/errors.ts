interface ErrorBody {
  message?: string;
  error?: string;
  error_code?: string;
  title?: string;
  errors?: Record<string, string[]>;
  retry_after?: number;
  locked_until?: string;
}

export class ApiError extends Error {
  status: number;
  code: string | null;
  fieldErrors: Record<string, string[]>;
  retryAfter?: number;
  lockedUntil?: string;

  constructor(
    status: number,
    message: string,
    code: string | null = null,
    fieldErrors: Record<string, string[]> = {},
    retryAfter?: number,
    lockedUntil?: string
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
    this.retryAfter = retryAfter;
    this.lockedUntil = lockedUntil;
  }
}

export function parseErrorResponse(status: number, body: unknown): ApiError {
  const candidate = (body ?? {}) as ErrorBody;

  // RFC 7807 problem+json
  if (candidate.error_code && candidate.title) {
    return new ApiError(status, candidate.title, candidate.error_code, {}, candidate.retry_after, candidate.locked_until);
  }

  // 422 validation — field errors
  if (status === 422 && candidate.errors && typeof candidate.errors === "object") {
    return new ApiError(
      status,
      candidate.message ?? "The given data was invalid.",
      "VALIDATION_ERROR",
      candidate.errors
    );
  }

  // business error { error, message }
  if (candidate.error && typeof candidate.error === "string") {
    return new ApiError(
      status,
      candidate.message ?? candidate.error,
      candidate.error,
      {},
      candidate.retry_after,
      candidate.locked_until
    );
  }

  return new ApiError(status, candidate.message ?? "Request failed.", null, {}, candidate.retry_after, candidate.locked_until);
}
