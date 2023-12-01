export interface AuthUser {
  name?: string
  provider?: string
  phone?: string
  providerId?: string
  uid?: string
  email?: string
  avatar?: string
  locale?: string
  status?: AuthStatus
  timestamp?: Date
}

export interface AuthStatusTotalResponse {
  cafe: number
  customer: number
  blocked: number
}

export type AuthProvider = 'google' | 'facebook' | 'apple' | 'anonymous'

export type AuthStatus = 'cafe' | 'customer' | 'farm' | 'requested' | 'blocked'
