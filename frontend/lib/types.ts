export type UserRole = "customer" | "admin"

export interface AuthContext {
  walletAddress: string
  role: UserRole
  customerId?: string
}
