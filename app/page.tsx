import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-blue-100 to-white">
      <h1 className="text-4xl font-bold mb-6 text-blue-800">Welcome to Read n Rise</h1>
      <p className="text-xl mb-8 max-w-2xl text-center text-gray-700">
        Enhance your reading comprehension skills with our interactive learning platform. 
        Start your journey to better understanding today.
      </p>
      <div className="space-x-4">
        <Button asChild>
          <Link href="/signup">Get Started</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </main>
  )
}

