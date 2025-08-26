import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
  const { email, password, full_name } = await request.json()

  // Server-side validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 })
  }
  if (!password || password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 })
  }
  if (!full_name || full_name.trim().length === 0) {
    return NextResponse.json({ error: "Full name is required." }, { status: 400 })
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
      },
    },
  })

  if (error) {
    // Generalize error message for security
    let errorMessage = "Registration failed. Please try again."
    if (error.message.includes("User already registered")) {
      errorMessage = "A user with this email already exists."
    } else if (error.message.includes("Password is too weak")) {
      errorMessage = "Password is too weak. Please choose a stronger password."
    }
    return NextResponse.json({ error: errorMessage }, { status: 400 })
  }

  return NextResponse.json({ message: "User registered successfully", user: data.user })
}