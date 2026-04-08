export function ok(data: unknown, extra: Record<string, unknown> = {}) {
  return Response.json({ ok: true, ...extra, data });
}

export function fail(error: string, status = 500) {
  return Response.json({ ok: false, error }, { status });
}