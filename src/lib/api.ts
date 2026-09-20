import axios, { AxiosError } from 'axios'

export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '')

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json',
  },
})

let csrfPrimed = false

/**
 * Laravel Sanctum's SPA auth needs a first GET to /sanctum/csrf-cookie to
 * receive the XSRF-TOKEN cookie; axios then echoes it back as the
 * X-XSRF-TOKEN header on every request automatically.
 */
export async function ensureCsrfCookie(): Promise<void> {
  if (csrfPrimed) return
  await axios.get(`${API_URL}/sanctum/csrf-cookie`, { withCredentials: true })
  csrfPrimed = true
}

export function discordAuthRedirectUrl(): string {
  return `${API_URL}/auth/discord/redirect`
}

export interface ApiErrorShape {
  message?: string
  errors?: Record<string, string[]>
}

export function extractErrorMessage(error: unknown, fallback = 'Something went wrong.'): string {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<ApiErrorShape>
    const data = err.response?.data
    if (data?.errors) {
      const first = Object.values(data.errors)[0]?.[0]
      if (first) return first
    }
    if (data?.message) return data.message
    if (err.message) return err.message
  }
  if (error instanceof Error) return error.message
  return fallback
}
