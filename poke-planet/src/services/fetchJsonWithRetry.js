export async function fetchJsonWithRetry(
  url,
  { retries = 2, timeoutMs = 10000 } = {},
) {
  let lastError = null;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeoutMs);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Request to ${url} failed with status ${response.status}.`,
        );
      }

      return await response.json();
    } catch (error) {
      lastError = error;

      if (attempt < retries) {
        console.warn(
          `Request attempt ${attempt} of ${retries} failed for ${url}. Retrying...`,
          error,
        );
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  if (lastError?.name === "AbortError") {
    throw new Error(`Request to ${url} timed out.`);
  }

  throw lastError ?? new Error(`Request to ${url} failed.`);
}
