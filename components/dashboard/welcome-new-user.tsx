"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Vote, Users, BarChart3, Rocket } from "lucide-react"

export function WelcomeNewUser() {
  return (
    <div className="space-y-8">
      {/* Welcome Hero */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
            <Rocket className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome to Polly! 🎉</CardTitle>
          <CardDescription className="text-base">
            You're all set up and ready to start creating engaging polls. Let's get you started!
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button size="lg" asChild>
            <Link href="/polls/create">
              <Vote className="mr-2 h-4 w-4" />
              Create Your First Poll
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Quick Stats - New User Version */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Polls</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Ready to create your first!
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
            <Vote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Waiting for your polls
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Polls</CardTitle>
            <Vote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Create one to get started
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential Reach</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">∞</div>
            <p className="text-xs text-muted-foreground">
              Unlimited possibilities
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Vote className="h-5 w-5 text-primary" />
            Quick Start Guide
          </CardTitle>
          <CardDescription>
            Here are some tips to get you started with your first poll
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="mx-auto mb-2 p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full w-fit">
                <span className="text-xl">🎯</span>
              </div>
              <h4 className="font-medium mb-1">Choose a Clear Question</h4>
              <p className="text-sm text-muted-foreground">
                Make your poll question specific and easy to understand
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="mx-auto mb-2 p-2 bg-green-100 dark:bg-green-900/20 rounded-full w-fit">
                <span className="text-xl">📝</span>
              </div>
              <h4 className="font-medium mb-1">Add Great Options</h4>
              <p className="text-sm text-muted-foreground">
                Provide 2-5 clear, distinct choices for your audience
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="mx-auto mb-2 p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full w-fit">
                <span className="text-xl">🚀</span>
              </div>
              <h4 className="font-medium mb-1">Share & Engage</h4>
              <p className="text-sm text-muted-foreground">
                Share your poll link to start collecting votes
              </p>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Button variant="outline" asChild>
              <Link href="/polls">
                Browse Example Polls
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
