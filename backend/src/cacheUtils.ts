import redis from './redisClient';

/**
 * Get or set cache from Redis
 * @param key Cache key
 * @param fetchFn Function to fetch data if not in cache
 * @param expiration Expiration time in seconds (default 1 hour)
 */
export async function getOrSetCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  expiration: number = 3600
): Promise<T> {
  try {
    const cachedData = await redis.get(key);
    if (cachedData) {
      return JSON.parse(cachedData) as T;
    }

    const data = await fetchFn();
    await redis.setex(key, expiration, JSON.stringify(data));
    return data;
  } catch (error) {
    console.error(`Cache error for key ${key}:`, error);
    // If cache fails, just fetch data directly
    return await fetchFn();
  }
}
