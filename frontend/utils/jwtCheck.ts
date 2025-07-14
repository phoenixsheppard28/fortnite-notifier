import { VerifyJWT, JwtPayload } from './jwtUtils'
import { jwtDecode } from 'jwt-decode'

/**
 * Checks if a JWT is expired based on its expiration time
 * @param token - JWT token to check
 * @returns {boolean} - true if token is not expired, false if expired or invalid
 */
function isNotExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<JwtPayload>(token)
    if (!decoded.exp) return false

    // exp is in seconds, Date.now() is in milliseconds
    return decoded.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

/**
 * Checks for a JWT in the URL search params or localStorage, verifies it, and returns user info if valid.
 * @param searchParams - URLSearchParams instance (from next/navigation or window.location.search)
 * @returns {Promise<{ jwt: string | null, username: string | null }>} - Valid JWT and username if available
 */
export async function checkAndStoreJwt(
  searchParams: URLSearchParams,
): Promise<{ jwt: string | null; username: string | null }> {
  let just_verified = false
  let username: string | null = null
  let jwt: string | null = null

  const currJwt = searchParams.get('token')
  if (currJwt) {
    const valid = await VerifyJWT(currJwt)
    if (valid) {
      localStorage.setItem('jwt', currJwt)
      just_verified = true
    }
  }

  return await checkJwt()
}

/**
 * Checks for a valid JWT in localStorage and returns jwt and username if valid
 * @returns {Promise<{ jwt: string | null, username: string | null }>} - Valid JWT and username if available
 */
export async function checkJwt(): Promise<{
  jwt: string | null
  username: string | null
}> {
  const storedJwt = localStorage.getItem('jwt')
  if (!storedJwt) return { jwt: null, username: null }

  // Check if token is expired locally first
  if (!isNotExpired(storedJwt)) {
    localStorage.removeItem('jwt') // Clean up expired token
    return { jwt: null, username: null }
  }

  // Only verify with server if not expired locally
  const valid = await VerifyJWT(storedJwt)
  if (!valid) {
    localStorage.removeItem('jwt')
    return { jwt: null, username: null }
  }

  let username: string | null = null
  try {
    username = jwtDecode<JwtPayload>(storedJwt).username
  } catch {
    username = null
  }

  return { jwt: storedJwt, username }
}
