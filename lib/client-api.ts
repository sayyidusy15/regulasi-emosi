export type ApiEnvelope<T> = { ok: true; data: T } | { ok: false; error: string };

export class ClientApiError extends Error {
  constructor(message: string, public status = 0) {
    super(message);
  }
}

export async function clientApi<T>(url: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      signal: init.signal || AbortSignal.timeout(10_000),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ClientApiError("Permintaan terlalu lama. Periksa koneksi lalu coba lagi.", 408);
    }
    throw new ClientApiError("Server sedang tidak dapat dihubungi. Coba lagi sebentar.", 503);
  }

  let result: ApiEnvelope<T>;
  try {
    result = (await response.json()) as ApiEnvelope<T>;
  } catch {
    throw new ClientApiError("Server mengirim respons yang tidak valid.", response.status);
  }

  if (!response.ok || !result.ok) {
    throw new ClientApiError(result.ok ? "Permintaan gagal diproses." : result.error, response.status);
  }
  return result.data;
}
