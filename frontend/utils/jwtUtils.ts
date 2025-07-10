import axios from 'axios'

export async function VerifyJWT(jwt: string): Promise<boolean> {
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/verify-jwt',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: jwt,
        },
      },
    )
    if (!res.ok) return false
    const data = await res.json()
    return data['valid']
  } catch (error) {
    return false
  }
}
export type JwtPayload = {
  id: number
  username: string
  exp?: number
  iat?: number
  nbf?: number
  iss?: string
  aud?: string | string[]
  sub?: string
}
