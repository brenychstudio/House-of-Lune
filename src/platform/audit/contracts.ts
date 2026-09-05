export type AuditActor = Readonly<{
  actorType: "CUSTOMER" | "STAFF" | "SYSTEM" | "PROVIDER";
  actorId: string;
}>;

export type AuditRecord = Readonly<{
  id: string;
  actor: AuditActor;
  action: string;
  resourceType: string;
  resourceId: string;
  correlationId: string;
  occurredAt: string;
  before: Readonly<Record<string, unknown>> | null;
  after: Readonly<Record<string, unknown>> | null;
  result: "SUCCEEDED" | "REJECTED" | "FAILED";
  approvalReference: string | null;
}>;
