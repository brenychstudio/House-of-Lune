import type { PasswordlessDelivery, PasswordlessDeliveryProvider } from "@/modules/customers/delivery";

class DevelopmentPasswordlessDelivery implements PasswordlessDeliveryProvider {
  private readonly deliveries = new Map<string, PasswordlessDelivery>();

  async deliverAccountLink(input: PasswordlessDelivery) {
    const delay = Number.parseInt(process.env.BRENYCH_IDENTITY_TEST_DELIVERY_DELAY_MS ?? "0", 10);
    if (Number.isFinite(delay) && delay > 0 && delay <= 5_000) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    this.deliveries.set(`${input.customerId}:${input.purpose}`, input);
  }

  take(customerId: string, purpose: PasswordlessDelivery["purpose"]) {
    const key = `${customerId}:${purpose}`;
    const delivery = this.deliveries.get(key) ?? null;
    this.deliveries.delete(key);
    return delivery;
  }
}

export const developmentPasswordlessDelivery = new DevelopmentPasswordlessDelivery();

export const unavailablePasswordlessDelivery: PasswordlessDeliveryProvider = {
  async deliverAccountLink() {
    throw new Error("PASSWORDLESS_DELIVERY_NOT_CONFIGURED");
  },
};

export function passwordlessDeliveryForEnvironment() {
  const enabled =
    process.env.BRENYCH_ENV === "development" &&
    process.env.BRENYCH_IDENTITY_DEV_HARNESS === "1";
  return enabled ? developmentPasswordlessDelivery : unavailablePasswordlessDelivery;
}
