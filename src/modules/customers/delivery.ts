import type { PasswordlessPurpose } from "@/modules/customers/account";

export type PasswordlessDelivery = Readonly<{
  customerId: string;
  email: string;
  purpose: PasswordlessPurpose;
  url: string;
  expiresAt: Date;
}>;

export interface PasswordlessDeliveryProvider {
  deliverAccountLink(input: PasswordlessDelivery): Promise<void>;
}
