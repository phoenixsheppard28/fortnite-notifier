export async function call_backend({
  method,
  jwt,
  path,
}: {
  method: string
  jwt: string | null
  path: string
}) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`
  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: jwt ?? '',
      },
    })
    return res
  } catch (err) {
    throw err
  }
}
