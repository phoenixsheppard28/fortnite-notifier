import Link from 'next/link'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
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
      <main className="container mx-auto px-4 py-20 max-w-3xl">
        <h1 className="text-4xl font-bold mb-6">Support</h1>
        <p className="mb-4 text-gray-200">
          If you have an issue or request. you can open an issue on our{' '}
          <a
            href="https://github.com/phoenixsheppard28/fortnite-notifier/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-300"
          >
            GitHub repository
          </a>
          .
        </p>
        <p className="mb-4 text-gray-200">
          You can also contact me directly through the email listed on my{' '}
          <a
            href="https://github.com/phoenixsheppard28"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-300"
          >
            GitHub profile
          </a>
          .
        </p>
        <p className="mt-8 text-gray-400 text-sm">
          We aim to respond to all inquiries within 48 hours.
        </p>
      </main>
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Fortnite Notifier. All rights
          reserved.
        </div>
      </footer>
    </div>
  )
}
