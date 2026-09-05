export type CatalogRead<T> = { state: "READY"; data: T } | { state: "UNAVAILABLE"; data: null };

export async function readCatalog<T>(read: () => Promise<T>): Promise<CatalogRead<T>> {
  try {
    return { state: "READY", data: await read() };
  } catch {
    // Never send database exception text or substitute commercial defaults to the browser.
    return { state: "UNAVAILABLE", data: null };
  }
}
