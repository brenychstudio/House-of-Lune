export const PASSWORDLESS_TTL_SECONDS = 15 * 60;
export const AUTH_IDLE_TIMEOUT_SECONDS = 30 * 24 * 60 * 60;
export const AUTH_ABSOLUTE_LIFETIME_SECONDS = 90 * 24 * 60 * 60;
export const GUEST_SESSION_LIFETIME_SECONDS = 30 * 24 * 60 * 60;

type CookieContract = Readonly<{
  name: string;
  options: Readonly<{
    httpOnly: true;
    sameSite: "lax";
    secure: boolean;
    path: "/";
    maxAge: number;
  }>;
}>;

export function authCookieContract(secure: boolean): CookieContract {
  return {
    name: secure ? "__Host-br_session" : "br_session_dev",
    options: {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: AUTH_ABSOLUTE_LIFETIME_SECONDS,
    },
  };
}

export function guestCookieContract(secure: boolean): CookieContract {
  return {
    name: secure ? "__Host-br_guest" : "br_guest_dev",
    options: {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: GUEST_SESSION_LIFETIME_SECONDS,
    },
  };
}
