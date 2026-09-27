/**
 * Lightweight, high-performance Edge-compatible Rate Limiter
 * Supports both standalone in-memory sliding window and Upstash Redis REST.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory token bucket cache
const memoryStore = new Map<string, RateLimitRecord>();

// Clean up expired entries every 5 minutes to prevent memory leak
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    memoryStore.forEach((record, key) => {
      if (record.resetAt <= now) {
        memoryStore.delete(key);
      }
    });
  }, 300000);
}

export interface RateLimitConfig {
  limit: number;      // Maximum allowed requests within the window
  windowMs: number;   // Window duration in milliseconds (e.g. 60_000 for 1 min)
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Check and record a request against rate limits.
 */
export async function checkRateLimit(
  key: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const { limit, windowMs } = config;
  const now = Date.now();

  // 1. If Upstash Redis credentials exist, use distributed Redis REST API
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    try {
      const windowSec = Math.ceil(windowMs / 1000);
      const redisKey = `ratelimit:${key}`;

      // Pipeline INCR and EXPIRE in a single multi-exec via Upstash REST API
      const pipelineRes = await fetch(`${upstashUrl}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${upstashToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ["INCR", redisKey],
          ["EXPIRE", redisKey, windowSec],
          ["TTL", redisKey],
        ]),
      });

      if (pipelineRes.ok) {
        const results = await pipelineRes.json();
        const count = results[0]?.result || 1;
        const ttl = results[2]?.result || windowSec;

        return {
          success: count <= limit,
          limit,
          remaining: Math.max(0, limit - count),
          reset: now + ttl * 1000,
        };
      }
    } catch (err) {
      console.warn("Upstash rate limiter fallback to in-memory:", err);
    }
  }

  // 2. Standalone in-memory sliding window rate limiter
  const record = memoryStore.get(key);

  if (!record || record.resetAt <= now) {
    // New window
    const newRecord: RateLimitRecord = {
      count: 1,
      resetAt: now + windowMs,
    };
    memoryStore.set(key, newRecord);
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: newRecord.resetAt,
    };
  }

  // Existing window
  record.count += 1;
  const remaining = Math.max(0, limit - record.count);
  const success = record.count <= limit;

  return {
    success,
    limit,
    remaining,
    reset: record.resetAt,
  };
}
