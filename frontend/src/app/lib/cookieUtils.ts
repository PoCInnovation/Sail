export const COOKIE_NAME = 'sui_wallet';
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function setWalletCookie(address: string) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + COOKIE_MAX_AGE * 1000).toUTCString();
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(address)}; Max-Age=${COOKIE_MAX_AGE}; path=/; expires=${expires}; SameSite=Lax; ${process.env.NODE_ENV === 'production' ? 'Secure;' : ''}`;
}

export function getWalletCookie(): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^| )' + COOKIE_NAME + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : undefined;
}
