import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.tokenBucket(20, "1 m", 20),
  analytics: true,
});
