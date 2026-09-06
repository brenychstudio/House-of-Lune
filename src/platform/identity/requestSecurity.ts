export function requestUsesSecureCookies(request: Request) {
  const url = new URL(request.url);
  const forwarded = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  return url.protocol === "https:" || forwarded === "https";
}

export function isSameOriginMutation(request: Request) {
  const source = request.headers.get("origin") ?? request.headers.get("referer");
  const host = (request.headers.get("x-forwarded-host") ?? request.headers.get("host"))
    ?.split(",")[0]?.trim();
  if (!host) return false;
  const protocol = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim()
    ?? new URL(request.url).protocol.replace(":", "");
  if (source && source !== "null") {
    try { return new URL(source).origin === `${protocol}://${host}`; }
    catch { return false; }
  }
  return request.headers.get("sec-fetch-site") === "same-origin";
}

export function clientAbuseScope(request: Request) {
  const cloudflareAddress = request.headers.get("cf-connecting-ip")?.trim();
  const developmentForwardedAddress = process.env.BRENYCH_ENV === "development"
    ? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    : null;
  const address = cloudflareAddress || developmentForwardedAddress;
  return address && /^[0-9a-f:.]{3,64}$/i.test(address)
    ? `network:${address.toLowerCase()}`
    : "network:unattributed";
}
