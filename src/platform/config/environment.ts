export type AppEnvironment = "development" | "preview" | "production";

export type PublicEnvironment = Readonly<{
  environment: AppEnvironment;
  siteUrl: URL;
  indexable: boolean;
}>;

type EnvironmentInput = Readonly<Record<string, string | undefined>>;

function parseEnvironment(value: string | undefined): AppEnvironment {
  const environment = value ?? "development";

  if (!["development", "preview", "production"].includes(environment)) {
    throw new Error(`Unsupported BRENYCH_ENV: ${environment}`);
  }

  return environment as AppEnvironment;
}

function parseSiteUrl(value: string | undefined): URL {
  try {
    return new URL(value ?? "http://localhost:3000");
  } catch {
    throw new Error("NEXT_PUBLIC_SITE_URL must be an absolute URL");
  }
}

export function readPublicEnvironment(input: EnvironmentInput): PublicEnvironment {
  const environment = parseEnvironment(input.BRENYCH_ENV);
  const siteUrl = parseSiteUrl(input.NEXT_PUBLIC_SITE_URL);

  if (environment === "production" && siteUrl.protocol !== "https:") {
    throw new Error("Production site URL must use HTTPS");
  }

  return {
    environment,
    siteUrl,
    indexable: environment === "production",
  };
}
