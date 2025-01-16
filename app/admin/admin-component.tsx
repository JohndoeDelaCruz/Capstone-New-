'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusIcon, TrashIcon, SaveIcon } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { Level, Reading, Question, getLevels, updateLevels } from '../actions/levels'

export default function AdminComponent() {
  const [levels, setLevels] = useState<Level[]>([])
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null)
  const [selectedReading, setSelectedReading] = useState<Reading | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchLevels = async () => {
      const data = await getLevels()
      setLevels(data)
    }
    fetchLevels()
  }, [])

  const handleSaveChanges = async () => {
    try {
      await updateLevels(levels)
      toast({
        title: "Changes saved",
        description: "Your changes have been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddLevel = () => {
    const newLevel: Level = {
      id: levels.length + 1,
      title: `New Level ${levels.length + 1}`,
      readings: [],
      unlocked: false
    }
    setLevels([...levels, newLevel])
    setSelectedLevel(newLevel)
  }

  const handleAddReading = () => {
    if (!selectedLevel) return
    
    const newReading: Reading = {
      id: selectedLevel.readings.length + 1,
      title: 'New Reading',
      content: '',
      questions: [],
      completed: false,
      difficulty: 'easy'
    }
    
    const updatedLevel = {
      ...selectedLevel,
      readings: [...selectedLevel.readings, newReading]
    }
    
    setLevels(levels.map(l => l.id === selectedLevel.id ? updatedLevel : l))
    setSelectedLevel(updatedLevel)
    setSelectedReading(newReading)
  }

  const handleAddQuestion = () => {
    if (!selectedReading) return
    
    const newQuestion: Question = {
      id: selectedReading.questions.length + 1,
      text: '',
      answer: '',
      points: 10
    }
    
    const updatedReading = {
      ...selectedReading,
      questions: [...selectedReading.questions, newQuestion]
    }
    
    setSelectedReading(updatedReading)
    updateReading(updatedReading)
  }

  const updateReading = (updatedReading: Reading) => {
    if (!selectedLevel) return
    
    const updatedLevel = {
      ...selectedLevel,
      readings: selectedLevel.readings.map(r => 
        r.id === updatedReading.id ? updatedReading : r
      )
    }
    
    setLevels(levels.map(l => l.id === selectedLevel.id ? updatedLevel : l))
    setSelectedLevel(updatedLevel)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={handleSaveChanges}>
          <SaveIcon className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
      
      <Tabs defaultValue="content" className="space-y-4">
        <TabsList>
          <TabsTrigger value="content">Content Management</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Content Management</h2>
            <Button onClick={handleAddLevel}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Level
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Levels List */}
            <Card>
              <CardHeader>
                <CardTitle>Levels</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {levels.map(level => (
                  <Button
                    key={level.id}
                    variant={selectedLevel?.id === level.id ? "default" : "outline"}
                    className="w-full justify-between"
                    onClick={() => setSelectedLevel(level)}
                  >
                    {level.title}
                    <span className="text-sm text-muted-foreground">
                      {level.readings.length} readings
                    </span>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Readings List */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Readings</CardTitle>
                {selectedLevel && (
                  <Button size="sm" onClick={handleAddReading}>
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-2">
                {selectedLevel?.readings.map(reading => (
                  <Button
                    key={reading.id}
                    variant={selectedReading?.id === reading.id ? "default" : "outline"}
                    className="w-full justify-between"
                    onClick={() => setSelectedReading(reading)}
                  >
                    {reading.title}
                    <span className="text-sm text-muted-foreground">
                      {reading.questions.length} questions
                    </span>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Editor */}
            <Card>
              <CardHeader>
                <CardTitle>Editor</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedReading ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Title</label>
                      <Input
                        value={selectedReading.title}
                        onChange={(e) => {
                          const updated = { ...selectedReading, title: e.target.value }
                          setSelectedReading(updated)
                          updateReading(updated)
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Content</label>
                      <Textarea
                        value={selectedReading.content}
                        onChange={(e) => {
                          const updated = { ...selectedReading, content: e.target.value }
                          setSelectedReading(updated)
                          updateReading(updated)
                        }}
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Difficulty</label>
                      <Select
                        value={selectedReading.difficulty}
                        onValueChange={(value: 'easy' | 'medium' | 'hard') => {
                          const updated = { ...selectedReading, difficulty: value }
                          setSelectedReading(updated)
                          updateReading(updated)
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Questions</label>
                        <Button size="sm" onClick={handleAddQuestion}>
                          <PlusIcon className="h-4 w-4" />
                        </Button>
                      </div>
                      {selectedReading.questions.map((question, index) => (
                        <Card key={question.id}>
                          <CardContent className="space-y-2 pt-4">
                            <Input
                              placeholder="Question text"
                              value={question.text}
                              onChange={(e) => {
                                const updatedQuestions = [...selectedReading.questions]
                                updatedQuestions[index] = {
                                  ...question,
                                  text: e.target.value
                                }
                                const updated = {
                                  ...selectedReading,
                                  questions: updatedQuestions
                                }
                                setSelectedReading(updated)
                                updateReading(updated)
                              }}
                            />
                            <div className="flex gap-2">
                              <Input
                                type="number"
                                placeholder="Points"
                                value={question.points}
                                onChange={(e) => {
                                  const updatedQuestions = [...selectedReading.questions]
                                  updatedQuestions[index] = {
                                    ...question,
                                    points: parseInt(e.target.value)
                                  }
                                  const updated = {
                                    ...selectedReading,
                                    questions: updatedQuestions
                                  }
                                  setSelectedReading(updated)
                                  updateReading(updated)
                                }}
                                className="w-24"
                              />
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => {
                                  const updatedQuestions = selectedReading.questions.filter(
                                    q => q.id !== question.id
                                  )
                                  const updated = {
                                    ...selectedReading,
                                    questions: updatedQuestions
                                  }
                                  setSelectedReading(updated)
                                  updateReading(updated)
                                }}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Select a reading to edit</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">User management features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Statistics dashboard coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

