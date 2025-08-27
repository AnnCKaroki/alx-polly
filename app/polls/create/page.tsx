"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowLeft, Plus, X } from "lucide-react"
import { createPoll } from "@/app/polls/actions"

export default function CreatePollPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [options, setOptions] = useState(["", ""]) // Start with 2 required
  const [endsAt, setEndsAt] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addOption = () => setOptions([...options, ""])
  const removeOption = (index: number) =>
    setOptions(options.filter((_, i) => i !== index))
  const updateOption = (index: number, value: string) =>
    setOptions(options.map((opt, i) => (i === index ? value : opt)))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || options.some((o) => !o.trim())) return

    setIsSubmitting(true)
    try {
      const poll = await createPoll({
        title,
        description,
        options,
        endsAt: endsAt ? new Date(endsAt) : undefined,
      })
      if (poll?.id) {
        router.push(`/polls/${poll.id}`)
      }
    } catch (err) {
      console.error("Failed to create poll:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/polls">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Polls
          </Link>
        </Button>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create New Poll</CardTitle>
            <CardDescription>
              Create a new poll for others to participate in
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="title" className="font-medium">Poll Title</label>
                <Input
                  id="title"
                  placeholder="e.g. What’s your favorite framework?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="font-medium">Description (optional)</label>
                <textarea
                  id="description"
                  placeholder="Tell people more about your poll..."
                  className="w-full border rounded p-2"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="font-medium">Options</label>
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      required
                    />
                    {options.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add Option
                </Button>
              </div>

              <div className="space-y-2">
                <label htmlFor="endsAt" className="font-medium">Ends At (optional)</label>
                <Input
                  type="datetime-local"
                  id="endsAt"
                  value={endsAt}
                  onChange={(e) => setEndsAt(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Poll"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
