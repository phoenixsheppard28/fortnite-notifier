import Link from 'next/link'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PrivacyPolicy() {
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
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
        <p className="mb-4 text-gray-200">
          Fortnite Notifier is committed to protecting your privacy. This
          Privacy Policy explains how we collect, use, and safeguard your
          information when you use our service.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-2">
          Information We Collect
        </h2>
        <ul className="list-disc ml-6 mb-4 text-gray-200">
          <li>Telegram user ID and username (for notification delivery)</li>
          <li>Tracked Fortnite items (skins, emotes, cosmetics)</li>
          <li>Basic usage data (for improving service reliability)</li>
        </ul>
        <h2 className="text-2xl font-semibold mt-8 mb-2">
          How We Use Your Information
        </h2>
        <ul className="list-disc ml-6 mb-4 text-gray-200">
          <li>To send notifications about Fortnite Item Shop updates</li>
          <li>To personalize your experience</li>
        </ul>
        <h2 className="text-2xl font-semibold mt-8 mb-2">Data Security</h2>
        <p className="mb-4 text-gray-200">
          We use industry-standard security measures to protect your data.
          Sensitive information is encrypted and never shared with third
          parties.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-2">
          Third-Party Services
        </h2>
        <p className="mb-4 text-gray-200">
          We do not sell or share your personal information. Notifications are
          sent via Telegram, and you are subject to Telegram's privacy policy
          when using their platform.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-2">Your Rights</h2>
        <p className="mb-4 text-gray-200">
          You may delete your account and data at any time by clicking the
          delete account button in the{' '}
          <Link href="/settings">
            <span className="text-blue-400 hover:text-blue-300">settings</span>
          </Link>{' '}
          menu.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-2">
          Changes to This Policy
        </h2>
        <p className="mb-4 text-gray-200">
          We may update this Privacy Policy from time to time. Changes will be
          posted on this page with the effective date.
        </p>
        <p className="mt-8 text-gray-400 text-sm">
          Last updated: July 13, 2025
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
