import { Client } from "pg";
import type { Env } from "../utils/types";

export function makeClient(env: Env) {
  const cs = env.HYPERDRIVE.connectionString;
  const isHyperdrive = cs.includes(".hyperdrive.local");

  return new Client({
    connectionString: cs,
    ...(isHyperdrive
      ? {}
      : {
          ssl: {
            rejectUnauthorized: false,
          },
        }),
  });
}