const BASE_URL = process.env.NEXT_PUBLIC_API_BASE

type RequestOptions = RequestInit & {
  params?: Record<string, string | number | boolean>
}

class ApiError extends Error {
  status: number
  data: any

  constructor(message: string, status: number, data?: any) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...rest } = options

  // Normalize BASE_URL and endpoint to ensure exactly one '/' between them
  const baseUrl = BASE_URL?.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const url = new URL(`${baseUrl}${path}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value))
    })
  }

  // default headers
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  }

  // JWT Token (Client-side usage example)
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`
    }
  }

  const response = await fetch(url.toString(), {
    ...rest,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  })

  if (!response.ok) {
    let errorData
    try {
      errorData = await response.json()
    } catch (e) {
      errorData = { message: response.statusText }
    }
    throw new ApiError(errorData.message || 'API Request failed', response.status, errorData)
  }

  if (response.status === 204) return {} as T

  return response.json()
}

export const api = {
  get: <T>(url: string, options?: RequestOptions) => request<T>(url, { ...options, method: 'GET' }),
  post: <T>(url: string, body?: any, options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: <T>(url: string, body?: any, options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(url: string, body?: any, options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(url: string, options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'DELETE' }),
}
