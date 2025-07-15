'use client'

import { useState } from 'react'
// ...existing code...
import { call_backend } from '@/utils/call_backend'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Bell,
  SettingsIcon,
  Trash2,
  RefreshCw,
  Globe,
  Clock,
  Shield,
  Zap,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  ArrowLeftFromLine,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { checkJwt } from '@/utils/jwtCheck'
import { useEffect } from 'react'
import { set } from 'date-fns'

export default function Settings() {
  const [dailyNotifications, setDailyNotifications] = useState(true)
  const [instantAlerts, setInstantAlerts] = useState(true)
  const [legendaryOnly, setLegendaryOnly] = useState(false)
  const [epicAndAbove, setEpicAndAbove] = useState(true)
  const [notificationTime, setNotificationTime] = useState('09:00')
  const [language, setLanguage] = useState('en')
  const [jwt, setJwt] = useState<string | null>(null)
  const [username, setUsername] = useState('')
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { jwt, username } = await checkJwt()
      if (!jwt) {
        router.replace('/users/not-signed-in')
      }
      setUsername(username ?? '')
      setJwt(jwt)
    }
    checkAuth()
  }, [router])
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 text-white hover:text-gray-300"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </Link>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Settings</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Authentication Status */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Authentication Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      username ? 'bg-green-400' : 'bg-red-400'
                    }`}
                  />
                  <div>
                    <p className="text-white font-medium">
                      {username
                        ? `Signed in with Telegram @${username}`
                        : 'Not Signed In'}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {username
                        ? `Your session is active`
                        : 'Please sign in to continue'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardContent className="flex justify-start">
              <Button
                variant="outline"
                className="border-black-400/50 text-black-400 hover:bg-gray-500/10"
                onClick={() => {
                  localStorage.removeItem('jwt')
                  router.replace('/')
                }}
                disabled={!username}
              >
                <ArrowLeftFromLine className="w-4 h-4 mr-2" />
                Log Out
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label
                        htmlFor="daily-notifications"
                        className="text-white font-medium"
                      >
                        Daily Shop Updates
                      </Label>
                      <p className="text-gray-400 text-sm">
                        Get daily Item Shop summaries
                      </p>
                    </div>
                    <Switch
                      id="daily-notifications"
                      checked={dailyNotifications}
                      onCheckedChange={setDailyNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label
                        htmlFor="instant-alerts"
                        className="text-white font-medium"
                      >
                        Instant Alerts
                      </Label>
                      <p className="text-gray-400 text-sm">
                        Immediate notifications for tracked items
                      </p>
                    </div>
                    <Switch
                      id="instant-alerts"
                      checked={instantAlerts}
                      onCheckedChange={setInstantAlerts}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-white font-medium">
                      Notification Time
                    </Label>
                    <p className="text-gray-400 text-sm mb-2">
                      When to send daily updates
                    </p>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <Input
                        type="time"
                        value={notificationTime}
                        onChange={(e) => setNotificationTime(e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-white/10" />

              <div>
                <h3 className="text-white font-medium mb-4">
                  Item Rarity Filters
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="legendary-only" className="text-white">
                        Legendary Items Only
                      </Label>
                      <p className="text-gray-400 text-sm">
                        Only notify for legendary rarity items
                      </p>
                    </div>
                    <Switch
                      id="legendary-only"
                      checked={legendaryOnly}
                      onCheckedChange={setLegendaryOnly}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="epic-and-above" className="text-white">
                        Epic and Above
                      </Label>
                      <p className="text-gray-400 text-sm">
                        Notify for Epic and Legendary items
                      </p>
                    </div>
                    <Switch
                      id="epic-and-above"
                      checked={epicAndAbove}
                      onCheckedChange={setEpicAndAbove}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* Danger Zone */}
          <Card className="bg-red-500/5 border-red-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="text-white font-medium">
                    Clear All Tracked Items
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Remove all items from your tracking list.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                  onClick={async () => {
                    if (
                      !window.confirm(
                        'Are you sure you want to clear all tracked items? This action cannot be undone.',
                      )
                    )
                      return
                    try {
                      const res = await call_backend({
                        method: 'DELETE',
                        jwt,
                        path: '/user/item/all',
                      })
                      if (res.ok) {
                        alert('All tracked items cleared!')
                      } else {
                        alert('Failed to clear items.')
                      }
                    } catch (err) {
                      alert('Error clearing items.')
                    }
                  }}
                  disabled={!username}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All Items
                </Button>
              </div>

              <Separator className="bg-red-500/20" />

              <div>
                <h4 className="text-white font-medium">Delete Account</h4>
                <p className="text-gray-400 text-sm">
                  Permanently delete your account and all associated data. This
                  action cannot be undone
                </p>
                <Button
                  variant="destructive"
                  className="mt-2 bg-red-600 hover:bg-red-700"
                  onClick={async () => {
                    if (
                      !window.confirm(
                        'Are you sure you want to delete your account? This action cannot be undone.',
                      )
                    )
                      return
                    try {
                      const res = await call_backend({
                        method: 'DELETE',
                        jwt,
                        path: '/user/me',
                      })
                      if (res.ok) {
                        alert('Account deleted successfully!')
                        localStorage.removeItem('jwt')
                        router.replace('/')
                      } else {
                        alert('Failed to delete account.')
                      }
                    } catch (err) {
                      alert('Error deleting account.')
                    }
                  }}
                  disabled={!username}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
