import { fetchJsonWithRetry } from './fetchJsonWithRetry';

export async function fetchImageData(searchTerm) {
  if (!searchTerm || typeof searchTerm !== 'string') {
    throw new Error('A NASA image search term is required.');
  }

  const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(searchTerm)}`;
  const json = await fetchJsonWithRetry(url);
  const imageUrl = json?.collection?.items?.[0]?.links?.[0]?.href;

  if (!imageUrl) {
    throw new Error(`No NASA image was found for "${searchTerm}".`);
  }

  return imageUrl;
}