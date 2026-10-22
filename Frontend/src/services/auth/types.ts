export type Role = 'admin' | 'member'

/** `GET /me`: the signed-in user and what they may do. */
export interface CurrentUser {
  id: string
  name: string
  email: string
  role: Role
  permissions: string[]
}

/** `POST /auth/token`: exchanges the one-time OAuth code for an access token. */
export interface TokenResponse {
  accessToken: string
  expiresIn: number
}
