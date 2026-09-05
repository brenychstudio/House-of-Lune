export type DomainEvent<Payload extends Record<string, unknown> = Record<string, unknown>> = Readonly<{
  eventId: string;
  eventType: string;
  schemaVersion: number;
  aggregateType: string;
  aggregateId: string;
  correlationId: string;
  causationId: string | null;
  occurredAt: string;
  payload: Readonly<Payload>;
}>;

export type OutboxStatus = "PENDING" | "PROCESSING" | "PUBLISHED" | "DEAD_LETTER";
