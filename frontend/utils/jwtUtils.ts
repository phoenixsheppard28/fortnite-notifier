import axios from "axios"

export async function VerifyJWT(jwt: string): Promise<boolean> {
    const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/auth/verify-jwt",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token: jwt })
        }
    )
    if (!res.ok) return false
    const data = await res.json()
    return data["valid"]
}
export type JwtPayload = {
    id: number
    username: string
    exp: number
}
