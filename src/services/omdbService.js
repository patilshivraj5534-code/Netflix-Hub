import axios from 'axios';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = 'https://www.omdbapi.com/';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 8000
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Non-2xx HTTP status
      throw new Error(error.response.data?.Error || 'Unexpected server error.');
    }
    if (error.request) {
      // No response received
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
);

export async function searchMovies(query) {
  if (!query || query.trim().length === 0) return [];
  if (!API_KEY) {
    throw new Error('Missing OMDB API key. Check VITE_OMDB_API_KEY env variable.');
  }

  const params = {
    apikey: API_KEY,
    s: query.trim(),
    type: 'movie'
  };

  const { data } = await client.get('/', { params });

  if (data.Response === 'False') {
    if (data.Error === 'Movie not found!') {
      return [];
    }
    throw new Error(data.Error || 'Failed to fetch movies.');
  }

  return data.Search ?? [];
}

export async function getMovieById(id) {
  if (!id) throw new Error('Missing movie id.');
  if (!API_KEY) {
    throw new Error('Missing OMDB API key. Check VITE_OMDB_API_KEY env variable.');
  }

  const params = {
    apikey: API_KEY,
    i: id,
    plot: 'full'
  };

  const { data } = await client.get('/', { params });

  if (data.Response === 'False') {
    throw new Error(data.Error || 'Failed to fetch movie details.');
  }

  return data;
}

