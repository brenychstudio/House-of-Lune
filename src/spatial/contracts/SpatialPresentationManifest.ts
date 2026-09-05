export type SpatialPresentationManifest = Readonly<{
  id: string;
  objectSlug: string;
  version: number;
  fallback: Readonly<{
    label: string;
    description: string;
  }>;
}>;
