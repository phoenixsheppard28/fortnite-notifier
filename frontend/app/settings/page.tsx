"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"
import Link from "next/link"

export default function Settings() {
  const [dailyNotifications, setDailyNotifications] = useState(true)
  const [instantAlerts, setInstantAlerts] = useState(true)
  const [legendaryOnly, setLegendaryOnly] = useState(false)
  const [epicAndAbove, setEpicAndAbove] = useState(true)
  const [notificationTime, setNotificationTime] = useState("09:00")
  const [language, setLanguage] = useState("en")
  const [telegramConnected, setTelegramConnected] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-2 text-white hover:text-gray-300">
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
          {/* Telegram Connection */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Telegram Bot Connection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${telegramConnected ? "bg-green-400" : "bg-red-400"}`} />
                  <div>
                    <p className="text-white font-medium">
                      {telegramConnected ? "Connected to Telegram" : "Not Connected"}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {telegramConnected ? "@FortniteNotifierBot" : "Connect to receive notifications"}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={telegramConnected ? "default" : "destructive"}
                  className="bg-green-500/20 text-green-400"
                >
                  {telegramConnected ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" /> Active
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3 h-3 mr-1" /> Inactive
                    </>
                  )}
                </Badge>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Resend Authorization
                </Button>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
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
                      <Label htmlFor="daily-notifications" className="text-white font-medium">
                        Daily Shop Updates
                      </Label>
                      <p className="text-gray-400 text-sm">Get daily Item Shop summaries</p>
                    </div>
                    <Switch
                      id="daily-notifications"
                      checked={dailyNotifications}
                      onCheckedChange={setDailyNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="instant-alerts" className="text-white font-medium">
                        Instant Alerts
                      </Label>
                      <p className="text-gray-400 text-sm">Immediate notifications for tracked items</p>
                    </div>
                    <Switch id="instant-alerts" checked={instantAlerts} onCheckedChange={setInstantAlerts} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-white font-medium">Notification Time</Label>
                    <p className="text-gray-400 text-sm mb-2">When to send daily updates</p>
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
                <h3 className="text-white font-medium mb-4">Item Rarity Filters</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="legendary-only" className="text-white">
                        Legendary Items Only
                      </Label>
                      <p className="text-gray-400 text-sm">Only notify for legendary rarity items</p>
                    </div>
                    <Switch id="legendary-only" checked={legendaryOnly} onCheckedChange={setLegendaryOnly} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="epic-and-above" className="text-white">
                        Epic and Above
                      </Label>
                      <p className="text-gray-400 text-sm">Notify for Epic and Legendary items</p>
                    </div>
                    <Switch id="epic-and-above" checked={epicAndAbove} onCheckedChange={setEpicAndAbove} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* General Settings */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <SettingsIcon className="w-5 h-5" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-white">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <Globe className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Time Zone</Label>
                  <Select defaultValue="est">
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <Clock className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="est">Eastern (EST)</SelectItem>
                      <SelectItem value="pst">Pacific (PST)</SelectItem>
                      <SelectItem value="cst">Central (CST)</SelectItem>
                      <SelectItem value="mst">Mountain (MST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="text-white font-medium">Data Protection</h4>
                    <p className="text-gray-300 text-sm mt-1">
                      Your tracking preferences are encrypted and stored securely. We never share your data with third
                      parties.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  View Privacy Policy
                </Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>

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
                  <h4 className="text-white font-medium">Clear All Tracked Items</h4>
                  <p className="text-gray-400 text-sm">
                    Remove all items from your tracking list. This action cannot be undone.
                  </p>
                </div>
                <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All Items
                </Button>
              </div>

              <Separator className="bg-red-500/20" />

              <div>
                <h4 className="text-white font-medium">Delete Account</h4>
                <p className="text-gray-400 text-sm">Permanently delete your account and all associated data.</p>
                <Button variant="destructive" className="mt-2 bg-red-600 hover:bg-red-700">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8">
              <CheckCircle className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
