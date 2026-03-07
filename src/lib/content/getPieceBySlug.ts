import { featuredPieces } from "@/content/pieces";

export function getPieceBySlug(slug: string) {
  return featuredPieces.find((piece) => piece.slug === slug);
}
