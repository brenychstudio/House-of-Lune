export type PieceCategory = "Necklace" | "Ring" | "Earrings" | "Bracelet";

export type AvailabilityMode = "By Appointment" | "Limited Series" | "Private Commission";

export type Piece = {
  slug: string;
  category: PieceCategory;
  name: string;
  headline: string;
  shortDescription: string;
  material: string;
  stone: string;
  edition: string;
  availabilityMode: AvailabilityMode;
  heroImage: string;
  featuredCardImage?: string;
  campaignImage?: string;
  onBodyImage?: string;
  macroImages: string[];
  gallery: string[];
  story?: string[];
};
