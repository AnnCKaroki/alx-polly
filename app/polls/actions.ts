'use server'

import { revalidatePath } from "next/cache"
import { cookies } from 'next/headers'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'

// Basic XSS sanitization function
function sanitizeInput(input: string | undefined): string | undefined {
  if (!input) return undefined
  return input.replace(/<script.*?>.*?<\/script>/g, '').replace(/<[^>]*>/g, '')
}

export async function createPoll(
  pollData: {
    title: string
    description: string | undefined
    options: string[]
    endsAt: Date | undefined
  }
) {
  const supabase = createServerActionClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    throw new Error("You must be logged in to create a poll.")
  }

  // Server-side validation
  const sanitizedTitle = sanitizeInput(pollData.title)
  if (!sanitizedTitle || sanitizedTitle.trim().length === 0) {
    throw new Error("Poll title cannot be empty.")
  }

  const sanitizedDescription = sanitizeInput(pollData.description)

  const validOptions = pollData.options.map(opt => sanitizeInput(opt) || '').filter(opt => opt.trim().length > 0)
  if (validOptions.length < 2) {
    throw new Error("A poll must have at least two valid options.")
  }

  if (pollData.endsAt && new Date(pollData.endsAt) < new Date()) {
    throw new Error("End date cannot be in the past.")
  }

  const { data, error } = await supabase
    .from("polls")
    .insert([{
      title: sanitizedTitle,
      description: sanitizedDescription,
      ends_at: pollData.endsAt,
      user_id: session.user.id,
    }])
    .select()

  if (error) {
    throw error
  }

  const poll = data[0]

  const { error: optionsError } = await supabase.from("options").insert(
    validOptions.map(optionText => ({
      text: optionText,
      poll_id: poll.id,
    }))
  )

  if (optionsError) {
    // If creating options fails, delete the poll to avoid orphaned polls
    await supabase.from("polls").delete().eq("id", poll.id)
    throw optionsError
  }

  revalidatePath("/polls")
  revalidatePath(`/polls/${poll.id}`)

  return poll
}

export async function getPoll(pollId: string) {
  const supabase = createServerActionClient({ cookies })
  const { data: poll, error } = await supabase
    .from("polls")
    .select(`
      *,
      options (*),
      votes (*)
    `)
    .eq("id", pollId)
    .single()

  if (error) {
    throw error
  }

  return poll
}

export async function vote(pollId: string, optionId: string) {
  const supabase = createServerActionClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    throw new Error("You must be logged in to vote.")
  }

  const { data, error } = await supabase
    .from("votes")
    .insert([{
      poll_id: pollId,
      option_id: optionId,
      user_id: session.user.id,
    }])

  if (error) {
    throw error
  }

  revalidatePath(`/polls/${pollId}`)

  return data
}

export async function hasVoted(pollId: string) {
  const supabase = createServerActionClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return false
  }

  const { data, error } = await supabase
    .from("votes")
    .select("id")
    .eq("poll_id", pollId)
    .eq("user_id", session.user.id)

  if (error) {
    throw error
  }

  return data.length > 0
}

export async function getDashboardStats() {
  const supabase = createServerActionClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return {
      totalPolls: 0,
      totalVotes: 0,
      activePolls: 0,
      avgVotesPerPoll: 0,
    }
  }

  const { data: polls, error: pollsError } = await supabase
    .from("polls")
    .select("id, ends_at")
    .eq("user_id", session.user.id)

  if (pollsError) {
    throw pollsError
  }

  const pollIds = polls.map((p: { id: any }) => p.id)

  const { data: votes, error: votesError } = await supabase
    .from("votes")
    .select("id")
    .in("poll_id", pollIds)

  if (votesError) {
    throw votesError
  }

  const totalPolls = polls.length
  const totalVotes = votes.length
  const activePolls = polls.filter((p: { ends_at: string | number | Date }) => !p.ends_at || new Date(p.ends_at) > new Date()).length
  const avgVotesPerPoll = totalPolls > 0 ? totalVotes / totalPolls : 0

  return {
    totalPolls,
    totalVotes,
    activePolls,
    avgVotesPerPoll,
  }
}

export async function getRecentPolls() {
  const supabase = createServerActionClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return []
  }

  const { data: polls, error } = await supabase
    .from("polls")
    .select(`
      *,
      options (*),
      votes (*)
    `)
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(3)

  if (error) {
    throw error
  }

  return polls
}

export async function getAllPolls() {
  const supabase = createServerActionClient({ cookies })
  const { data: polls, error } = await supabase
    .from("polls")
    .select(`
      *,
      options (*),
      votes (*)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    throw error
  }

  return polls
}
