'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function NotSignedIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Card className="max-w-md w-full bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white text-center">
            Not Signed In
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-gray-300">
            You must be signed in to access this page.
            <br />
            Please sign in with telegram on the home page
          </p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 w-full">
              Go to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
