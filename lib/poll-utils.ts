export function generatePollUrl(pollId: string): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/polls/${pollId}`
  }
  return `/polls/${pollId}`
}

export async function copyPollLink(pollId: string): Promise<boolean> {
  const pollUrl = generatePollUrl(pollId)
  
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(pollUrl)
      return true
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = pollUrl
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const success = document.execCommand('copy')
      document.body.removeChild(textArea)
      return success
    }
  } catch (error) {
    console.error('Failed to copy poll link:', error)
    return false
  }
}

export async function sharePoll(pollId: string, title: string): Promise<boolean> {
  const pollUrl = generatePollUrl(pollId)
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: `Vote on: ${title}`,
        text: `Check out this poll and cast your vote!`,
        url: pollUrl,
      })
      return true
    } catch (error) {
      // User cancelled sharing or error occurred
      console.log('Sharing cancelled or failed:', error)
      return false
    }
  } else {
    // Fallback to copying link
    return copyPollLink(pollId)
  }
}

export function generateMockPollId(): string {
  return `poll_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Formats a Date object for use in datetime-local inputs
 * Avoids timezone conversion issues by using local time methods
 */
export function formatDateForInput(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

/**
 * Parses datetime-local input value to Date object
 * The input value is already in local timezone
 */
export function parseDateFromInput(value: string): Date | undefined {
  if (!value) return undefined
  return new Date(value)
}

/**
 * Formats a date for display with timezone awareness
 */
export function formatDateForDisplay(date: Date): string {
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  })
}
