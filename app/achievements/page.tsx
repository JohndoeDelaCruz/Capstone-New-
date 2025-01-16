'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const achievements = [
  { id: 1, name: "Bookworm", description: "Read 10 passages", progress: 40, max: 10 },
  { id: 2, name: "Streak Master", description: "Maintain a 7-day streak", progress: 3, max: 7 },
  { id: 3, name: "Perfect Score", description: "Get 100% on 5 passages", progress: 2, max: 5 },
  { id: 4, name: "Speed Reader", description: "Complete 3 passages in under 10 minutes", progress: 1, max: 3 },
]

export default function AchievementsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Achievements</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement) => (
          <Card key={achievement.id}>
            <CardHeader>
              <CardTitle>{achievement.name}</CardTitle>
              <CardDescription>{achievement.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={(achievement.progress / achievement.max) * 100} className="w-full" />
              <p className="text-sm text-gray-600 mt-2">
                Progress: {achievement.progress} / {achievement.max}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

