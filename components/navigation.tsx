'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"

export default function Navigation() {
  const pathname = usePathname()
  const isLoggedIn = pathname !== '/' && pathname !== '/login' && pathname !== '/signup'

  return (
    <nav className="flex justify-between items-center py-4 px-8 bg-white shadow-sm">
      <Link href="/" className="text-2xl font-bold text-blue-800">
        Read n Rise
      </Link>
      <div className="space-x-4">
        {isLoggedIn ? (
          <>
            <Button variant="ghost" asChild>
              <Link href="/main">Dashboard</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/achievements">Achievements</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/leaderboard">Leaderboard</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/">Logout</Link>
            </Button>
          </>
        ) : pathname === '/' ? (
          <>
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </>
        ) : (
          <Button variant="ghost" asChild>
            <Link href="/">Home</Link>
          </Button>
        )}
      </div>
    </nav>
  )
}

