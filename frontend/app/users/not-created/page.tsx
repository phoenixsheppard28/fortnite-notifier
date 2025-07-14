'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { UserX, AlertTriangle, ArrowLeft, UserPlus } from 'lucide-react'
import Link from 'next/link'
import TelegramLoginButton from '@/components/TelegramLoginButtom'

export default function UserNotCreatedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <UserX className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              Fortnite Notifier
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          {/* Warning Badge */}

          {/* Main Message */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserX className="w-12 h-12 text-white" />
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Account Not Found
            </h1>

            <p className="text-xl text-gray-300 mb-8">
              It looks like you don't have an account yet. Type{' '}
              <code>/create</code> into chat with{' '}
              <a
                href="https://t.me/fortniteshopskinbot"
                style={{ textDecoration: 'underline' }}
              >
                https://t.me/fortniteshopskinbot
              </a>
            </p>
          </div>

          {/* Action Card */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm mb-8">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserPlus className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-2xl font-bold text-white mb-4">
                Create Your Account
              </h2>

              <p className="text-gray-300 mb-2">
                We use the bot{' '}
                <a
                  href="https://t.me/fortniteshopskinbot"
                  className="underline"
                >
                  @fortniteshopskinbot
                </a>{' '}
                to manage accounts and associate it with your unique Telegram
                ID. Follow these steps:
              </p>
              <ol className="text-gray-300 list-decimal list-inside space-y-1 mb-6">
                <li>
                  Begin chat with the bot, then type <code>/create</code>
                </li>
                <li>
                  Return to this website (you can get the url from the bot with{' '}
                  <code>/link</code>)
                </li>
                <li>Click the Telegram login widget like you did before</li>
                <li>Happy tracking!</li>
              </ol>
            </CardContent>
          </Card>

          {/* Additional Info */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Why Create an Account?
                </h3>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li>• Track unlimited Fortnite items</li>
                  <li>• Get instant Telegram notifications</li>
                  <li>• Access your personal dashboard</li>
                  <li>• Manage your preferences</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  What You'll Get
                </h3>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li>• Real-time Item Shop alerts</li>
                  <li>• Item price tracking</li>
                  <li>• Custom notification settings</li>
                  <li>• Item history and statistics</li>
                </ul>
              </CardContent>
            </Card>
          </div> */}

          {/* Footer Links */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 text-gray-400 text-sm">
              <Link href="/" className="hover:text-white transition-colors">
                Back to Home
              </Link>
              <Link
                href="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
