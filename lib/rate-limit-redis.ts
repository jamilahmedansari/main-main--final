import { NextRequest, NextResponse } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// Create a Redis client
const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.REDIS_URL || "",
  token: process.env.KV_REST_API_TOKEN || "",
})

// Rate limiters with different configurations
export const authRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(5, "15 m"), // 5 requests per 15 minutes
  analytics: true,
  prefix: "auth",
})

export const apiRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(100, "1 m"), // 100 requests per minute
  analytics: true,
  prefix: "api",
})

export const adminRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(10, "15 m"), // 10 requests per 15 minutes
  analytics: true,
  prefix: "admin",
})

export const letterGenerationRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(5, "1 h"), // 5 letters per hour
  analytics: true,
  prefix: "letter-gen",
})

export const subscriptionRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(3, "1 h"), // 3 subscription attempts per hour
  analytics: true,
  prefix: "subscription",
})

// Helper function to get client IP
function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')

  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  if (realIP) {
    return realIP
  }

  if (cfConnectingIP) {
    return cfConnectingIP
  }

  return request.ip || 'unknown'
}

// Helper function to apply rate limiting
export async function applyRateLimit(
  request: NextRequest,
  rateLimiter: Ratelimit,
  identifier?: string
): Promise<NextResponse | null> {
  const ip = identifier || getClientIP(request)

  const { success, limit, reset, remaining } = await rateLimiter.limit(ip)

  if (!success) {
    const resetTimeSeconds = Math.ceil((reset - Date.now()) / 1000)

    return NextResponse.json(
      {
        error: "Rate limit exceeded. Please try again later.",
        retryAfter: resetTimeSeconds,
        limit,
        remaining,
        reset
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
          'Retry-After': resetTimeSeconds.toString()
        }
      }
    )
  }

  // Return null if rate limit not exceeded
  return null
}

// Fallback to in-memory rate limiting if Redis is not available
export async function safeApplyRateLimit(
  request: NextRequest,
  rateLimiter: Ratelimit,
  fallbackLimit: number,
  fallbackWindow: string,
  identifier?: string
): Promise<NextResponse | null> {
  try {
    return await applyRateLimit(request, rateLimiter, identifier)
  } catch (error) {
    console.warn('[RateLimit] Redis unavailable, falling back to in-memory:', error)

    // Fallback to in-memory rate limiting
    const memoryKey = identifier || getClientIP(request)
    const windowMs = parseWindowToMs(fallbackWindow)

    // Use in-memory store as fallback
    const now = Date.now()
    const store = global.rateLimitStore || (global.rateLimitStore = new Map())

    const key = `fallback:${rateLimiter.prefix}:${memoryKey}`
    const data = store.get(key) || { count: 0, resetTime: now + windowMs }

    if (data.resetTime < now) {
      data.count = 0
      data.resetTime = now + windowMs
    }

    data.count++
    store.set(key, data)

    if (data.count > fallbackLimit) {
      const resetTimeSeconds = Math.ceil((data.resetTime - now) / 1000)

      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please try again later.",
          retryAfter: resetTimeSeconds
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': fallbackLimit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': data.resetTime.toString(),
            'Retry-After': resetTimeSeconds.toString()
          }
        }
      )
    }

    return null
  }
}

function parseWindowToMs(window: string): number {
  const units: { [key: string]: number } = {
    's': 1000,
    'm': 60 * 1000,
    'h': 60 * 60 * 1000,
    'd': 24 * 60 * 60 * 1000
  }

  const match = window.match(/^(\d+)\s*([smhd])$/)
  if (!match) return 60 * 1000 // Default to 1 minute

  const [, num, unit] = match
  return parseInt(num) * (units[unit] || 60 * 1000)
}

// Extend global type for in-memory store
declare global {
  var rateLimitStore: Map<string, { count: number; resetTime: number }> | undefined
}