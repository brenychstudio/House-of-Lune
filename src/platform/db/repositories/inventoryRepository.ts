import type { PoolClient } from "pg";

export async function reserveEdition(
  client: PoolClient,
  editionId: string,
  reservedUntil: Date,
): Promise<boolean> {
  const result = await client.query(
    `UPDATE editions
     SET state = 'RESERVED', reserved_until = $2
     WHERE id = $1 AND state = 'AVAILABLE'
     RETURNING id`,
    [editionId, reservedUntil],
  );
  return result.rowCount === 1;
}

export async function releaseEdition(client: PoolClient, editionId: string): Promise<boolean> {
  const result = await client.query(
    `UPDATE editions
     SET state = 'AVAILABLE', reserved_until = NULL
     WHERE id = $1 AND state = 'RESERVED'
     RETURNING id`,
    [editionId],
  );
  return result.rowCount === 1;
}

export async function reserveCapacity(
  client: PoolClient,
  capacityWindowId: string,
  quantity: number,
): Promise<boolean> {
  const result = await client.query(
    `UPDATE capacity_windows
     SET reserved_units = reserved_units + $2
     WHERE id = $1 AND $2 > 0 AND total_units - reserved_units >= $2
     RETURNING id`,
    [capacityWindowId, quantity],
  );
  return result.rowCount === 1;
}

export async function releaseCapacity(
  client: PoolClient,
  capacityWindowId: string,
  quantity: number,
): Promise<boolean> {
  const result = await client.query(
    `UPDATE capacity_windows
     SET reserved_units = reserved_units - $2
     WHERE id = $1 AND $2 > 0 AND reserved_units >= $2
     RETURNING id`,
    [capacityWindowId, quantity],
  );
  return result.rowCount === 1;
}
