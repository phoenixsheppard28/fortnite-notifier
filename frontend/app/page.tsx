'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Zap,
  Target,
  Bell,
  Trophy,
  ArrowRight,
  Users,
  Shield,
  Gamepad2,
  Router,
} from 'lucide-react'
import Link from 'next/link'
import TelegramLoginButton from '@/components/TelegramLoginButtom'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import axios from 'axios'
import { checkAndStoreJwt } from '@/utils/jwtCheck'
import { jwtDecode } from 'jwt-decode'
import { JwtPayload } from '@/utils/jwtUtils'

function LandingPageContent() {
  const [jwt, setJwt] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    async function runJwtCheck() {
      const { jwt } = await checkAndStoreJwt(searchParams)
      setJwt(jwt)
    }
    runJwtCheck()
  }, [searchParams])

  useEffect(() => {
    if (jwt) {
      const user = jwtDecode<JwtPayload>(jwt).username
      const exp = jwtDecode<JwtPayload>(jwt).iat
      // console.log('User:', user)
      // console.log(exp)
      // console.log(jwt)
      setUsername(user)
    }
  }, [jwt])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              Fortnite Notifier
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Dashboard
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Settings
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Never miss your favorite{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Fortnite items
            </span>{' '}
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Get notified instantly on Telegram when your tracked skins, emotes,
            and cosmetics appear in the Fortnite Item Shop.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            {username ? (
              <span className="text-2xl font-semibold text-white flex items-center gap-2">
                Welcome, <span className="text-blue-400">{username}</span>
              </span>
            ) : (
              <TelegramLoginButton />
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Get started in three simple steps and never miss your favorite items
            again
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Track Items</h3>
              <p className="text-gray-300">
                Search and add your favorite Fortnite skins, emotes, and
                cosmetics to your tracking list
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Receive Alerts
              </h3>
              <p className="text-gray-300">
                Get instant Telegram notifications when your tracked items
                appear in the Item Shop
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Buy Skins!</h3>
              <p className="text-gray-300">
                Never miss limited-time offers and rare items. Get them before
                they're gone!
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Everything you need to stay on top of the Fortnite Item Shop
          </p>
        </div>

        <div className="flex justify-center items-center max-w-6xl mx-auto gap-6">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <CardContent className="p-6">
              <Shield className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Secure & Private
              </h3>
              <p className="text-gray-300 text-sm">
                Your data is encrypted and we never store sensitive information
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <CardContent className="p-6">
              <Gamepad2 className="w-8 h-8 text-indigo-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Real-time Updates
              </h3>
              <p className="text-gray-300 text-sm">
                Get notified within minutes of items appearing in the shop
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to never miss an item again?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of players who use Fortnite Notifier to stay ahead
              of the Item Shop
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <Zap className="w-5 h-5 mr-2" />
              Get Started Now
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded flex items-center justify-center">
                <Bell className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-semibold">
                Fortnite Notifier
              </span>
            </div>
            <div className="flex items-center space-x-6 text-gray-400 text-sm">
              <Link
                href="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/support"
                className="hover:text-white transition-colors"
              >
                Support
              </Link>
              <Link
                href="https://github.com/phoenixsheppard28/fortnite-notifier"
                className="hover:text-white transition-colors"
              >
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function LandingPage() {
  return (
    <Suspense
      fallback={<div className="text-white text-center py-20">Loading...</div>}
    >
      <LandingPageContent />
    </Suspense>
  )
}
