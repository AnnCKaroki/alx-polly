'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { createPoll } from "@/app/polls/actions"
import { useAuth } from "@/app/auth/context/auth-context"
import { formatDateForInput, parseDateFromInput } from "@/lib/poll-utils"
import { Plus, Trash2, CheckCircle2, Eye, Share2, RotateCcw, AlertCircle } from "lucide-react"

// Define the type for your form data
interface FormData {
    title: string;
    description: string;
    options: string[];
    endsAt: Date | undefined; // Corrected type to allow a Date object
}

export function CreatePollForm() {
    const router = useRouter()
    const { session } = useAuth()
    const [formData, setFormData] = useState<FormData>({ // Explicitly use the defined type
        title: "",
        description: "",
        options: ["", ""],
        endsAt: undefined,
    })
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [createdPollId, setCreatedPollId] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [copySuccess, setCopySuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Filter out empty options
        const validOptions = formData.options.filter(option => option.trim() !== "")

        if (validOptions.length < 2) {
            setError("Please provide at least 2 options")
            setIsLoading(false)
            return
        }

        const pollData = {
            ...formData,
            options: validOptions
        }

        setError(null) // Clear any previous errors

        try {
            const poll = await createPoll(pollData)
            setCreatedPollId(poll.id)
            setIsSuccess(true)
            console.log("Poll created successfully with ID:", poll.id)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to create poll. Please try again."
            setError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...formData.options]
        newOptions[index] = value
        setFormData(prev => ({
            ...prev,
            options: newOptions
        }))
    }

    const addOption = () => {
        if (formData.options.length < 10) {
            setFormData(prev => ({
                ...prev,
                options: [...prev.options, ""]
            }))
        }
    }

    const removeOption = (index: number) => {
        if (formData.options.length > 2) {
            const newOptions = formData.options.filter((_, i) => i !== index)
            setFormData(prev => ({
                ...prev,
                options: newOptions
            }))
        }
    }

    // Show success screen after poll creation
    if (isSuccess && createdPollId) {
        return (
            <div className="text-center space-y-6">
                <div className="mx-auto mb-4 p-3 bg-green-100 dark:bg-green-900/20 rounded-full w-fit">
                    <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">
                        Poll Created Successfully! 🎉
                    </h2>
                    <p className="text-muted-foreground mb-2">
                        Your poll "<span className="font-medium text-foreground">{formData.title}</span>" is now live and ready to collect votes.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Poll ID: <code className="bg-muted px-1 py-0.5 rounded text-xs">{createdPollId}</code>
                    </p>
                </div>

                <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                        <h3 className="font-semibold mb-4">What would you like to do next?</h3>
                        <div className="grid gap-3 sm:grid-cols-3">
                            <Button
                                asChild
                                size="sm"
                                className="flex flex-col h-auto py-4 px-3"
                            >
                                <a href={`/polls/${createdPollId}`}>
                                    <Eye className="h-4 w-4 mb-2" />
                                    <span className="text-xs">View Your Poll</span>
                                </a>
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                className="flex flex-col h-auto py-4 px-3"
                                onClick={async () => {
                                    await navigator.clipboard.writeText(`${window.location.origin}/polls/${createdPollId}`)
                                    setCopySuccess(true)
                                    setTimeout(() => setCopySuccess(false), 2000)
                                }}
                            >
                                {copySuccess ? (
                                    <>
                                        <CheckCircle2 className="h-4 w-4 mb-2 text-green-600" />
                                        <span className="text-xs">Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Share2 className="h-4 w-4 mb-2" />
                                        <span className="text-xs">Copy Poll Link</span>
                                    </>
                                )}
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                className="flex flex-col h-auto py-4 px-3"
                                onClick={() => {
                                    setIsSuccess(false)
                                    setCreatedPollId(null)
                                    setFormData({
                                        title: "",
                                        description: "",
                                        options: ["", ""],
                                        endsAt: undefined,
                                    })
                                }}
                            >
                                <RotateCcw className="h-4 w-4 mb-2" />
                                <span className="text-xs">Create Another</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex gap-3 justify-center">
                    <Button variant="outline" asChild>
                        <a href="/dashboard">Go to Dashboard</a>
                    </Button>
                    <Button asChild>
                        <a href={`/polls/${createdPollId}`}>View Poll</a>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        <span className="text-sm text-destructive">{error}</span>
                    </div>
                </div>
            )}
            <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                    Poll Title *
                </label>
                <Input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="What's your question?"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                    Description (Optional)
                </label>
                <textarea
                    id="description"
                    name="description"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Add more context to your poll..."
                    value={formData.description}
                    onChange={handleInputChange}
                />
            </div>

            <div className="space-y-4">
                <label className="text-sm font-medium">Poll Options *</label>
                {formData.options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                        <Input
                            type="text"
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            required={index < 2}
                        />
                        {formData.options.length > 2 && (
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeOption(index)}
                                className="shrink-0"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                ))}

                {formData.options.length < 10 && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={addOption}
                        className="w-full"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Option
                    </Button>
                )}
            </div>

            <div className="space-y-2">
                <label htmlFor="endsAt" className="text-sm font-medium">
                    End Date (Optional)
                </label>
                <Input
                    id="endsAt"
                    name="endsAt"
                    type="datetime-local"
                    value={formData.endsAt ? formatDateForInput(formData.endsAt) : ""}
                    onChange={(e) => {
                        const value = e.target.value
                        setFormData(prev => ({
                            ...prev,
                            endsAt: parseDateFromInput(value)
                        }))
                    }}
                    min={formatDateForInput(new Date())}
                />
                <p className="text-xs text-muted-foreground">
                    Leave empty for polls that never expire. Time is in your local timezone.
                </p>
            </div>

            <div className="flex gap-3">
                <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? "Creating Poll..." : "Create Poll"}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.back()}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
            </div>
        </form>
    )
}
