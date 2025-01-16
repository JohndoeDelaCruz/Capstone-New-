'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BookOpenIcon, CheckIcon, AwardIcon, BarChartIcon, LockIcon } from 'lucide-react'
import Link from 'next/link'
import { Badge } from "@/components/ui/badge"

type Difficulty = 'easy' | 'medium' | 'hard'

interface Question {
  id: number
  text: string
  answer: string
  points: number
}

interface Reading {
  id: number
  title: string
  content: string
  questions: Question[]
  completed: boolean
  difficulty: Difficulty
}

interface Level {
  id: number
  title: string
  readings: Reading[]
  unlocked: boolean
}

const initialUserData = {
  name: "",
  level: 1,
  xp: 0,
  totalPoints: 0,
  streak: 3,
}

const levels: Level[] = [
  {
    id: 1,
    title: "Beginner",
    readings: [
      {
        id: 1,
        title: 'The Importance of Reading',
        content: 'Reading is fundamental to functioning in today\'s society...',
        questions: [
          { id: 1, text: 'What is the main idea of this passage?', answer: '', points: 10 },
          { id: 2, text: 'Name two daily activities that become difficult for people who can\'t read well.', answer: '', points: 15 },
        ],
        completed: false,
        difficulty: 'easy'
      },
      {
        id: 2,
        title: 'The Benefits of Exercise',
        content: 'Regular exercise is one of the most important things you can do for your health...',
        questions: [
          { id: 1, text: 'What are three benefits of regular exercise mentioned in the passage?', answer: '', points: 15 },
          { id: 2, text: 'How can exercise impact your mental health?', answer: '', points: 10 },
        ],
        completed: false,
        difficulty: 'easy'
      },
    ],
    unlocked: true
  },
  {
    id: 2,
    title: "Intermediate",
    readings: [
      {
        id: 3,
        title: 'The Wonders of Space Exploration',
        content: 'Space exploration has captivated human imagination for centuries...',
        questions: [
          { id: 1, text: 'What are two major milestones in space exploration mentioned in the passage?', answer: '', points: 10 },
          { id: 2, text: 'How has space exploration impacted our daily lives?', answer: '', points: 15 },
        ],
        completed: false,
        difficulty: 'medium'
      },
    ],
    unlocked: false
  },
  {
    id: 3,
    title: "Advanced",
    readings: [
      {
        id: 4,
        title: 'The Importance of Biodiversity',
        content: 'Biodiversity, the variety of life on Earth, is crucial for the health of our planet...',
        questions: [
          { id: 1, text: 'What is biodiversity and what does it encompass?', answer: '', points: 10 },
          { id: 2, text: 'List three ecosystem services supported by biodiversity.', answer: '', points: 15 },
        ],
        completed: false,
        difficulty: 'hard'
      },
    ],
    unlocked: false
  },
  {
    id: 4,
    title: "Expert",
    readings: [
      {
        id: 5,
        title: 'Quantum Computing: The Next Frontier',
        content: 'Quantum computing is an emerging field that promises to revolutionize computation...',
        questions: [
          { id: 1, text: 'What is a qubit and how does it differ from a classical bit?', answer: '', points: 20 },
          { id: 2, text: 'Name two potential applications of quantum computing.', answer: '', points: 15 },
        ],
        completed: false,
        difficulty: 'hard'
      },
    ],
    unlocked: false
  },
  {
    id: 5,
    title: "Master",
    readings: [
      {
        id: 6,
        title: 'The Ethics of Artificial Intelligence',
        content: 'As AI systems become more advanced and pervasive, ethical considerations are paramount...',
        questions: [
          { id: 1, text: 'What are two main ethical concerns surrounding AI development?', answer: '', points: 20 },
          { id: 2, text: 'How might AI impact employment in the future?', answer: '', points: 20 },
        ],
        completed: false,
        difficulty: 'hard'
      },
    ],
    unlocked: false
  },
]

const DifficultyBadge = ({ difficulty }: { difficulty: Difficulty }) => {
  const colorMap = {
    easy: 'bg-green-500',
    medium: 'bg-yellow-500',
    hard: 'bg-red-500'
  }

  return (
    <Badge className={`${colorMap[difficulty]} text-white`}>
      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
    </Badge>
  )
}

export default function MainPage() {
  const [userStats, setUserStats] = useState(initialUserData)
  const [gameState, setGameState] = useState<'levels' | 'readings' | 'questions'>('levels')
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null)
  const [selectedReading, setSelectedReading] = useState<Reading | null>(null)
  const [gameLevels, setGameLevels] = useState(levels)

  const handleLevelSelect = (level: Level) => {
    if (level.unlocked) {
      setSelectedLevel(level)
      setGameState('readings')
    } else {
      alert("This level is locked. Complete the previous levels to unlock it.")
    }
  }

  const handleReadingSelect = (reading: Reading) => {
    setSelectedReading(reading)
    setGameState('questions')
  }

  const handleAnswerChange = (questionId: number, answer: string) => {
    if (selectedReading) {
      const updatedReading = {
        ...selectedReading,
        questions: selectedReading.questions.map(q =>
          q.id === questionId ? { ...q, answer } : q
        )
      }
      setSelectedReading(updatedReading)
    }
  }

  const handleSubmit = () => {
    if (selectedReading && selectedLevel) {
      const allQuestionsAnswered = selectedReading.questions.every(q => q.answer.trim() !== '')
      if (allQuestionsAnswered) {
        const earnedPoints = selectedReading.questions.reduce((total, q) => total + q.points, 0)
        const difficultyMultiplier = selectedReading.difficulty === 'easy' ? 1 : selectedReading.difficulty === 'medium' ? 1.5 : 2
        const totalEarnedPoints = Math.round(earnedPoints * difficultyMultiplier)
        
        setUserStats(prev => ({
          ...prev,
          xp: prev.xp + totalEarnedPoints,
          totalPoints: prev.totalPoints + totalEarnedPoints,
          level: Math.floor((prev.xp + totalEarnedPoints) / 100) + 1,
          streak: prev.streak + 1,
        }))

        // Mark the reading as completed
        const updatedLevels = gameLevels.map(level =>
          level.id === selectedLevel.id
            ? {
                ...level,
                readings: level.readings.map(r =>
                  r.id === selectedReading.id ? { ...r, completed: true } : r
                )
              }
            : level
        )

        // Check if all readings in the current level are completed
        const currentLevelIndex = updatedLevels.findIndex(l => l.id === selectedLevel.id)
        const allReadingsCompleted = updatedLevels[currentLevelIndex].readings.every(r => r.completed)

        // If all readings are completed, unlock the next level
        if (allReadingsCompleted && currentLevelIndex < updatedLevels.length - 1) {
          updatedLevels[currentLevelIndex + 1].unlocked = true
        }

        setGameLevels(updatedLevels)
        setGameState('readings')
        setSelectedReading(null)
      } else {
        alert("Please answer all questions before submitting.")
      }
    }
  }

  const handleBackToLevels = () => {
    setGameState('levels')
    setSelectedLevel(null)
    setSelectedReading(null)
  }

  const handleBackToReadings = () => {
    setGameState('readings')
    setSelectedReading(null)
  }

  useEffect(() => {
    // Simulate fetching user data from a server or local storage
    const fetchUserData = () => {
      // In a real application, this would be an API call or reading from local storage
      const userData = {
        name: "John Doe", // This would normally come from the server or local storage
        level: 1,
        xp: 0,
        totalPoints: 0,
        streak: 3,
      }
      setUserStats(userData)
    }

    fetchUserData()
  }, [])

  return (
    <div className="flex min-h-screen bg-blue-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-4 border-r border-gray-200">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">
            {userStats.name ? `Welcome, ${userStats.name}!` : 'Welcome!'}
          </h2>
          <p className="text-lg font-semibold mb-2">Level {userStats.level}</p>
          <Progress value={(userStats.xp % 100)} className="w-full" />
          <p className="text-sm text-gray-600 mt-1">{userStats.xp % 100}/100 XP</p>
        </div>
        <div className="mt-auto pt-4 border-t border-gray-200">
          <Link href="/achievements" passHref>
            <Button variant="ghost" className="w-full justify-start">
              <AwardIcon className="mr-2 h-4 w-4" />
              Achievements
            </Button>
          </Link>
          <Link href="/leaderboard" passHref>
            <Button variant="ghost" className="w-full justify-start">
              <BarChartIcon className="mr-2 h-4 w-4" />
              Leaderboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-800">Read n Rise Challenge</h1>
          <div className="flex items-center space-x-4">
            <span className="text-lg font-semibold">🔥 {userStats.streak} day streak</span>
            <span className="text-lg font-semibold">🏆 {userStats.totalPoints} total points</span>
          </div>
        </div>

        {gameState === 'levels' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gameLevels.map((level) => (
              <Card key={level.id} className={`bg-white ${level.unlocked ? 'cursor-pointer hover:shadow-lg transition-shadow' : 'opacity-50'}`} onClick={() => handleLevelSelect(level)}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{level.title}</span>
                    {level.unlocked ? (
                      <Badge variant="secondary">{level.readings.filter(r => r.completed).length}/{level.readings.length}</Badge>
                    ) : (
                      <LockIcon className="h-5 w-5" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{level.unlocked ? `${level.readings.length} readings available` : 'Complete previous levels to unlock'}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {gameState === 'readings' && selectedLevel && (
          <>
            <Button onClick={handleBackToLevels} className="mb-4">Back to Levels</Button>
            <h2 className="text-xl font-bold mb-4">{selectedLevel.title} Readings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedLevel.readings.map((reading) => (
                <Card key={reading.id} className="bg-white cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleReadingSelect(reading)}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{reading.title}</span>
                      <DifficultyBadge difficulty={reading.difficulty} />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{reading.questions.length} questions</p>
                    {reading.completed && <CheckIcon className="h-5 w-5 text-green-500" />}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {gameState === 'questions' && selectedReading && (
          <>
            <Button onClick={handleBackToReadings} className="mb-4">Back to Readings</Button>
            <Card className="mb-8 bg-white">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{selectedReading.title}</span>
                  <DifficultyBadge difficulty={selectedReading.difficulty} />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{selectedReading.content}</p>
                <div className="space-y-4">
                  {selectedReading.questions.map(question => (
                    <Card key={question.id} className="bg-gray-50">
                      <CardHeader>
                        <CardTitle className="text-lg flex justify-between">
                          <span>{question.text}</span>
                          <span className="text-blue-600">{question.points} pts</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <textarea
                          placeholder="Type your answer here..."
                          value={question.answer}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          className="w-full p-2 border rounded"
                          rows={3}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Button className="mt-4" variant="default" onClick={handleSubmit}>
                  <CheckIcon className="mr-2 h-4 w-4" /> Submit Answers
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}

