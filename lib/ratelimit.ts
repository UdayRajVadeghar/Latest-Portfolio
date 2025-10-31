import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let ratelimitInstance: Ratelimit | null = null;

function getRatelimit(): Ratelimit {
  if (!ratelimitInstance) {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL || "",
      token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
    });

    ratelimitInstance = new Ratelimit({
      redis,
      limiter: Ratelimit.tokenBucket(20, "1 m", 20),
      analytics: true,
    });
  }
  return ratelimitInstance;
}

export const ratelimit = {
  limit: (identifier: string) => getRatelimit().limit(identifier),
};
