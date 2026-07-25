'use client';

interface ExternalSessionBannerProps {
  expiresAt: string;
  role: string;
}

export function ExternalSessionBanner({
  expiresAt,
  role,
}: ExternalSessionBannerProps) {
  const expiryDate = new Date(expiresAt);
  const now = new Date();
  const hoursLeft = Math.floor(
    (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60)
  );

  const isUrgent = hoursLeft < 24;
  const isExpired = hoursLeft < 0;

  if (isExpired) return null;

  const roleLabel = role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div
      className={`px-4 py-2 text-sm text-center ${
        isUrgent
          ? 'bg-red-50 text-red-700 border-b border-red-200'
          : 'bg-yellow-50 text-yellow-700 border-b border-yellow-200'
      }`}
    >
      You are logged in as an external guest ({roleLabel}). Your access expires
      on {expiryDate.toLocaleDateString()}.
      {isUrgent && <span className="font-semibold ml-1">Access expiring soon!</span>}
    </div>
  );
}
