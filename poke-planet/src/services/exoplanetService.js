import { fetchJsonWithRetry } from './fetchJsonWithRetry';

const EXOPLANET_QUERY = [
  'select hostname,pl_name,pl_orbper,pl_orbeccen,st_teff,pl_rade,pl_masse',
  'from ps',
  'where pl_rade <= 1.8 and pl_masse > 0',
].join(' ');

export async function fetchExoplanetData() {
  const endpoint =
    import.meta.env.VITE_EXOPLANET_API_URL ??
    '/api/exoplanets/TAP/sync';

  const targetUrl = new URL(endpoint, window.location.origin);

  targetUrl.searchParams.set('query', EXOPLANET_QUERY);
  targetUrl.searchParams.set('format', 'json');

  const json = await fetchJsonWithRetry(targetUrl.toString(), {
    retries: 2,
    timeoutMs: 12000,
  });

  if (!Array.isArray(json) || json.length === 0) {
    throw new Error(
      'The exoplanet service returned no usable records.',
    );
  }

  return json;
}