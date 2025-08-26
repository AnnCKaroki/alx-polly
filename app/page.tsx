import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { BarChart3, Users, Vote, Zap, Shield, Clock } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <BarChart3 className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Create Polls That Matter
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Gather opinions, make decisions, and engage your audience with beautiful,
            interactive polls. Simple to create, easy to share, powerful to analyze.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild>
              <Link href="/polls/create">
                <Vote className="mr-2 h-4 w-4" />
                Create Your First Poll
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/polls">
                Browse Polls
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Polly?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to create engaging polls and gather meaningful insights
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Create polls in seconds with our intuitive interface
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Engage Your Audience</CardTitle>
              <CardDescription>
                Beautiful, responsive polls that work on any device
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Real-time Results</CardTitle>
              <CardDescription>
                Watch votes come in live with dynamic visualizations
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Secure & Private</CardTitle>
              <CardDescription>
                Your data is protected with enterprise-grade security
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Time Controls</CardTitle>
              <CardDescription>
                Set expiration dates or keep polls open indefinitely
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Vote className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Easy Sharing</CardTitle>
              <CardDescription>
                Share polls instantly via links or social media
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-2xl mx-auto text-center">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">
              Ready to Get Started?
            </CardTitle>
            <CardDescription className="text-lg">
              Join thousands of users creating engaging polls every day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" asChild>
                <Link href="/auth/register">
                  Sign Up Free
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/login">
                  Sign In
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span className="font-semibold">Polly</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 Polly. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
