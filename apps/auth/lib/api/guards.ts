export interface TokenData {
  access_token: string;
  expires_in: number;
  token_type: string;
  refresh_token: string;
  user_id: string;
}

export interface TokenResponse {
  data: TokenData;
}

export interface MfaRequiredBody {
  mfa_required: true;
  mfa_token: string;
  message?: string;
}

export function isTokenResponse(body: unknown): body is TokenResponse {
  const candidate = body as TokenResponse | null;
  return (
    !!candidate &&
    typeof candidate.data === "object" &&
    candidate.data !== null &&
    typeof candidate.data.access_token === "string" &&
    typeof candidate.data.refresh_token === "string"
  );
}

export function isMfaRequired(body: unknown): body is MfaRequiredBody {
  const candidate = body as MfaRequiredBody | null;
  return (
    !!candidate &&
    candidate.mfa_required === true &&
    typeof candidate.mfa_token === "string"
  );
}
