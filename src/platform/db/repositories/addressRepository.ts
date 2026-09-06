import type { Pool, PoolClient } from "pg";

import { validateAddress, type CustomerAddressInput } from "@/modules/customers/account";

export type CustomerAddress = CustomerAddressInput & Readonly<{ id: string; customerId: string }>;

const selectColumns = `id,customer_id,kind,recipient_name,line_1,line_2,city,region,postal_code,country_code`;

function mapAddress(row: Record<string, string | null>): CustomerAddress {
  return {
    id: row.id!, customerId: row.customer_id!, kind: row.kind as "SHIPPING" | "BILLING",
    recipientName: row.recipient_name!, line1: row.line_1!, line2: row.line_2 ?? null,
    city: row.city!, region: row.region ?? null, postalCode: row.postal_code!, countryCode: row.country_code!,
  };
}

function validated(input: CustomerAddressInput) {
  const result = validateAddress(input);
  if (!result.ok) throw new Error(result.error.code);
  return result.value;
}

export async function createAddress(client: PoolClient, customerId: string, input: CustomerAddressInput) {
  const value = validated(input);
  const result = await client.query<Record<string, string | null>>(
    `INSERT INTO addresses (customer_id,kind,recipient_name,line_1,line_2,city,region,postal_code,country_code)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING ${selectColumns}`,
    [customerId, value.kind, value.recipientName, value.line1, value.line2, value.city, value.region, value.postalCode, value.countryCode],
  );
  return mapAddress(result.rows[0]!);
}

export async function getAddressForCustomer(pool: Pool, customerId: string, addressId: string) {
  const result = await pool.query<Record<string, string | null>>(
    `SELECT ${selectColumns} FROM addresses WHERE customer_id=$1 AND id=$2`, [customerId, addressId],
  );
  return result.rows[0] ? mapAddress(result.rows[0]) : null;
}

export async function listAddressesForCustomer(pool: Pool, customerId: string) {
  const result = await pool.query<Record<string, string | null>>(
    `SELECT ${selectColumns} FROM addresses WHERE customer_id=$1 ORDER BY created_at,id`, [customerId],
  );
  return result.rows.map(mapAddress);
}

export async function updateAddressForCustomer(
  client: PoolClient, customerId: string, addressId: string, input: CustomerAddressInput,
) {
  const value = validated(input);
  const result = await client.query<Record<string, string | null>>(
    `UPDATE addresses SET kind=$3,recipient_name=$4,line_1=$5,line_2=$6,city=$7,region=$8,postal_code=$9,country_code=$10
     WHERE customer_id=$1 AND id=$2 RETURNING ${selectColumns}`,
    [customerId, addressId, value.kind, value.recipientName, value.line1, value.line2, value.city, value.region, value.postalCode, value.countryCode],
  );
  return result.rows[0] ? mapAddress(result.rows[0]) : null;
}

export async function deleteAddressForCustomer(client: PoolClient, customerId: string, addressId: string) {
  const result = await client.query("DELETE FROM addresses WHERE customer_id=$1 AND id=$2", [customerId, addressId]);
  return result.rowCount === 1;
}
