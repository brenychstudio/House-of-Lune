export type ServiceLevel = "STANDARD" | "EXPRESS";
export type ShipmentState = "PENDING" | "LABEL_CREATED" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED";

export type Shipment = Readonly<{
  id: string;
  orderId: string;
  serviceLevel: ServiceLevel;
  state: ShipmentState;
  providerReference: string | null;
  trackingReference: string | null;
  insured: boolean;
  signatureRequired: boolean;
}>;
