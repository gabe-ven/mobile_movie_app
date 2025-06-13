export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
  headers: {
    accept: "application/json",
  },
};

export const fetchMovies = async ({ query }: { query: string }) => {
  try {
    // Log the API key to check if it's properly set
    console.log(
      "Using API key:",
      process.env.EXPO_PUBLIC_MOVIE_API_KEY
        ? "API key exists"
        : "API key missing"
    );

    // Add the API key as a query parameter, not as a header
    const apiKeyParam = `api_key=${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`;

    const endpoint = query
      ? `${
          TMDB_CONFIG.BASE_URL
        }/search/movie?${apiKeyParam}&query=${encodeURIComponent(query)}`
      : `${TMDB_CONFIG.BASE_URL}/discover/movie?${apiKeyParam}&sort_by=popularity.desc`;

    console.log("Fetching from endpoint:", endpoint);

    const response = await fetch(endpoint, {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API error (${response.status}): ${response.statusText}. Details: ${errorText}`
      );
    }

    const data = await response.json();
    console.log(
      "API response success, results count:",
      data.results?.length || 0
    );
    return data.results;
  } catch (err) {
    console.error("API fetch error:", err);
    throw err; // Re-throw to be caught by useFetch
  }
};
