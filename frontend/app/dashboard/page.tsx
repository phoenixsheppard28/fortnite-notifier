'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { checkAndStoreJwt, checkJwt } from '@/utils/jwtCheck'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Search,
  Plus,
  Bell,
  Clock,
  Star,
  Zap,
  Settings,
  LogOut,
  Calendar,
  TrendingUp,
  Check,
  X,
} from 'lucide-react'
import Link from 'next/link'

const mockActivity = [
  {
    id: 1,
    message: 'Raven appeared in the Item Shop!',
    time: '2 hours ago',
    type: 'alert',
  },
  {
    id: 2,
    message: 'Daily shop update received',
    time: '1 day ago',
    type: 'update',
  },
  {
    id: 3,
    message: 'Skull Trooper was added to tracking',
    time: '3 days ago',
    type: 'action',
  },
]

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('')
  const [dailyNotifications, setDailyNotifications] = useState(true)
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [trackingItems, setTrackingItems] = useState<Set<string>>(new Set())
  const [trackedItems, setTrackedItems] = useState<Set<string>>(new Set())
  const [untrackingItems, setUntrackingItems] = useState<Set<string>>(new Set())
  const [allTrackedItems, setAllTrackedItems] = useState<any[]>([])
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Search function with debounce
  const searchItems = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const jwt = localStorage.getItem('jwt')
      if (!jwt) {
        console.error('No JWT found')
        return
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/item?query=${query}`,
        {
          method: 'GET',
          headers: {
            Authorization: `${jwt}`,
            'Content-Type': 'application/json',
          },
        },
      )

      if (response.ok) {
        const data = await response.json()
        setSearchResults(data['items'])
        console.table(data['items'])
      } else {
        console.error('Search failed:', response.statusText)
        setSearchResults([])
      }
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  // Debounced search effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }
    const timeoutId = setTimeout(() => {
      searchItems(searchQuery)
    }, 500) // 500ms after user stops typing

    return () => clearTimeout(timeoutId)
  }, [searchQuery, searchItems])

  // Track item function
  const trackItem = useCallback(
    async (itemId: string) => {
      setTrackingItems((prev) => new Set([...prev, itemId]))

      try {
        const jwt = localStorage.getItem('jwt')
        if (!jwt) {
          console.error('No JWT found')
          return
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/item`,
          {
            method: 'POST',
            headers: {
              Authorization: `${jwt}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              item_ids: [itemId],
            }),
          },
        )

        if (response.ok) {
          console.log('Item tracked successfully')
          // Optionally refresh the tracked items or show success message
          setTrackedItems((prev) => new Set([...prev, itemId]))
          // Add the tracked item to the allTrackedItems array
          const trackedItem = searchResults.find(
            (item: any) => item.ID === itemId,
          )
          if (trackedItem) {
            setAllTrackedItems((prev) => [...prev, trackedItem])
          }
        } else {
          console.error('Failed to track item:', response.statusText)
        }
      } catch (error) {
        console.error('Track item error:', error)
      } finally {
        setTrackingItems((prev) => {
          const newSet = new Set(prev)
          newSet.delete(itemId)
          return newSet
        })
      }
    },
    [searchResults],
  )

  // Untrack item function
  const untrackItem = useCallback(async (itemId: string) => {
    setUntrackingItems((prev) => new Set([...prev, itemId]))

    try {
      const jwt = localStorage.getItem('jwt')
      if (!jwt) {
        console.error('No JWT found')
        return
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/item`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `${jwt}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            item_ids: [itemId],
          }),
        },
      )

      if (response.ok) {
        console.log('Item untracked successfully')
        // Optionally refresh the tracked items or show success message
        setTrackedItems((prev) => {
          const newSet = new Set(prev)
          newSet.delete(itemId)
          return newSet
        })
        // Remove the untracked item from the allTrackedItems array
        setAllTrackedItems((prev) => prev.filter((item) => item.ID !== itemId))
      } else {
        console.error('Failed to untrack item:', response.statusText)
      }
    } catch (error) {
      console.error('Untrack item error:', error)
    } finally {
      setUntrackingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }, [])

  // Fetch all tracked items function
  const fetchAllTrackedItems = useCallback(async () => {
    try {
      const jwt = localStorage.getItem('jwt')
      if (!jwt) {
        console.error('No JWT found')
        return
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/item/all`,
        {
          method: 'GET',
          headers: {
            Authorization: `${jwt}`,
            'Content-Type': 'application/json',
          },
        },
      )

      if (response.ok) {
        const data = await response.json()
        setAllTrackedItems(data['items'] || [])
        // Also populate the trackedItems set with the IDs for button state management
        const itemIds = data['items']?.map((item: any) => item.ID) || []
        setTrackedItems(new Set(itemIds))
        console.log('Fetched tracked items:', data['items'])
      } else {
        console.error('Failed to fetch tracked items:', response.statusText)
      }
    } catch (error) {
      console.error('Fetch tracked items error:', error)
    }
  }, [])

  // Memoized authentication check
  const checkAuth = useCallback(async () => {
    try {
      const { jwt, username } = await checkJwt()
      if (!jwt) {
        router.replace('/users/not-signed-in')
        return
      }
      setUsername(username ?? '')
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Auth check failed:', error)
      router.replace('/users/not-signed-in')
    }
  }, [router])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllTrackedItems()
    }
  }, [isAuthenticated, fetchAllTrackedItems])

  // Show loading screen while checking authentication
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">
                  Fortnite Notifier
                </span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-white/10 rounded-lg px-4 py-2">
                <div className="text-sm">
                  <div className="text-white font-medium">{username}</div>
                  <div className="text-gray-400">Signed In</div>
                </div>
              </div>

              <Link href="/settings">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Item Tracking Section */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Tracked Items
                  <Badge
                    variant="secondary"
                    className="ml-auto bg-white/10 text-white"
                  >
                    {allTrackedItems.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search Fortnite items to track..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                  {isSearching && (
                    <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>

                {/* Search Results - Only show after request completes */}
                {searchQuery && !isSearching && searchResults.length > 0 && (
                  <div className="space-y-2">
                    <div className="max-h-64 overflow-y-auto">
                      <h4 className="text-white font-medium text-sm mb-3">
                        Search Results:
                      </h4>
                      <div className="space-y-2">
                        {searchResults.map((item: any) => (
                          <div
                            key={item.ID}
                            className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <img
                                src={item.Image || '/placeholder.svg'}
                                alt={item.Name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div>
                                <h4 className="text-white font-medium text-sm">
                                  {item.Name}
                                </h4>
                                <div className="flex items-center space-x-2">
                                  <Badge
                                    variant="secondary"
                                    className={`
                                      text-xs
                                      ${
                                        item.Rarity === 'Legendary'
                                          ? 'bg-orange-500/20 text-orange-400'
                                          : ''
                                      }
                                      ${
                                        item.Rarity === 'Epic'
                                          ? 'bg-purple-500/20 text-purple-400'
                                          : ''
                                      }
                                      ${
                                        item.Rarity === 'Rare'
                                          ? 'bg-blue-500/20 text-blue-400'
                                          : ''
                                      }
                                      ${
                                        item.Rarity === 'Uncommon'
                                          ? 'bg-green-500/20 text-green-400'
                                          : ''
                                      }
                                    `}
                                  >
                                    {item.Rarity}
                                  </Badge>
                                  <span className="text-gray-400 text-xs">
                                    {item.Type} • {item.Price} V-Bucks
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => trackItem(item.ID)}
                              disabled={
                                trackingItems.has(item.ID) ||
                                trackedItems.has(item.ID)
                              }
                              className={`
                                ${
                                  trackedItems.has(item.ID)
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                                } 
                                disabled:opacity-50
                              `}
                            >
                              {trackingItems.has(item.ID) ? (
                                <div className="flex items-center space-x-1">
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                  <span>Tracking...</span>
                                </div>
                              ) : trackedItems.has(item.ID) ? (
                                <div className="flex items-center space-x-1">
                                  <Check className="w-3 h-3" />
                                  <span>Tracked</span>
                                </div>
                              ) : (
                                'Track'
                              )}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tracked Items List */}
                <div className="space-y-4">
                  {allTrackedItems.length === 0 ? (
                    <p className="text-white text-center py-8">
                      No tracked items yet. Add some from the search results!
                    </p>
                  ) : (
                    allTrackedItems.map((item) => (
                      <div
                        key={item.ID}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={item.Image || '/placeholder.svg'}
                            alt={item.Name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div>
                            <h3 className="text-white font-semibold">
                              {item.Name}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge
                                variant="secondary"
                                className={`
                                  ${
                                    item.Rarity === 'Legendary'
                                      ? 'bg-orange-500/20 text-orange-400'
                                      : ''
                                  }
                                  ${
                                    item.Rarity === 'Epic'
                                      ? 'bg-purple-500/20 text-purple-400'
                                      : ''
                                  }
                                  ${
                                    item.Rarity === 'Rare'
                                      ? 'bg-blue-500/20 text-blue-400'
                                      : ''
                                  }
                                  ${
                                    item.Rarity === 'Uncommon'
                                      ? 'bg-green-500/20 text-green-400'
                                      : ''
                                  }
                                `}
                              >
                                {item.Rarity}
                              </Badge>
                              <span className="text-gray-400 text-sm">
                                {item.Type} • {item.Price} V-Bucks
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => untrackItem(item.ID)}
                          disabled={untrackingItems.has(item.ID)}
                          className="bg-red-600 hover:bg-red-700 opacity-90"
                        >
                          {untrackingItems.has(item.ID) ? (
                            <div className="flex items-center space-x-1">
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                              <span>Untracking...</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1">
                              <X className="w-3 h-3" />
                              <span>Untrack</span>
                            </div>
                          )}
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
        </div>
      </div>
    </div>
  )
}
