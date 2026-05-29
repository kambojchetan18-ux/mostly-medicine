const DEFAULT_TIMEOUT_MS = 30_000;

export function fetchWithTimeout(
  url: string,
  init?: RequestInit & { timeoutMs?: number },
): Promise<Response> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, ...fetchInit } = init ?? {};
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  if (fetchInit.signal) {
    fetchInit.signal.addEventListener("abort", () => controller.abort());
  }

  return fetch(url, { ...fetchInit, signal: controller.signal }).finally(() =>
    clearTimeout(timer),
  );
}
