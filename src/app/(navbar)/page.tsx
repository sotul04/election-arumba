import type React from "react"
import Link from "next/link"
import {
  Calendar,
  Users,
  Award,
  CheckCircle,
  Briefcase,
  FileText,
  UserPlus,
  Globe,
  Lightbulb,
  CalendarIcon,
} from "lucide-react"
import { Badge } from "~/components/ui/badge"
import { Card, CardContent } from "~/components/ui/card"
import { CountdownTimer } from "~/components/countdown/countdown"
import { VotingCheck } from "~/components/voting"
export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen ">
      {/* Hero Section */}
      <section className="relative">
        {/* Background with overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background z-0" />

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge className="px-4 py-1 text-sm font-medium mb-4 animate-fade-in bg-primary/20 text-primary hover:bg-primary/30 border-primary/20">
              Arumba Election 2025
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Your Voice Matters in Shaping Our Future
            </h1>

            <div className="mt-12 p-4 bg-muted/50 rounded-lg">
              <CountdownTimer />
            </div>
            <VotingCheck />
          </div>
        </div>
      </section>

      {/* Positions Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Available Positions</h2>
              <p className="text-muted-foreground mt-4">
                These are the key roles that will shape the future of our organization
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PositionCard
                title="Ketua"
                description="The leader who will guide our organization with vision and dedication."
                icon={<UserPlus className="h-10 w-10 text-primary" />}
              />
              <PositionCard
                title="Bendahara"
                description="The financial manager ensuring transparency and accountability."
                icon={<Briefcase className="h-10 w-10 text-primary" />}
              />
              <PositionCard
                title="Sekretaris"
                description="The record-keeper and organizer, ensuring smooth administration."
                icon={<FileText className="h-10 w-10 text-primary" />}
              />
              <PositionCard
                title="Kadiv Internal"
                description="Strengthening teamwork and internal affairs."
                icon={<Users className="h-10 w-10 text-primary" />}
              />
              <PositionCard
                title="Kadiv Humas"
                description="Connecting our organization with the outside world through effective communication."
                icon={<Globe className="h-10 w-10 text-primary" />}
              />
              <PositionCard
                title="Kadiv Informasi dan Kreasi"
                description="Driving innovation and creativity in digital content and media."
                icon={<Lightbulb className="h-10 w-10 text-primary" />}
              />
              <PositionCard
                title="Kadiv Events"
                description="Planning and executing memorable and impactful events."
                icon={<CalendarIcon className="h-10 w-10 text-primary" />}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Vote Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Why Vote?</h2>
              <p className="text-muted-foreground mt-4">
                Your participation is crucial for the future of our organization
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Strong Leadership</h3>
                <p className="text-muted-foreground">Ensure strong leadership for our organization.</p>
              </div>

              <div className="text-center p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Transparency</h3>
                <p className="text-muted-foreground">Support transparency and fair governance.</p>
              </div>

              <div className="text-center p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Representation</h3>
                <p className="text-muted-foreground">Choose leaders who represent your vision and values.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Dates Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Important Dates</h2>
              <p className="text-muted-foreground mt-4">Mark your calendar for these key election events</p>
            </div>

            <div className="flex items-start p-6 rounded-lg border hover:shadow-md transition-shadow">
              <div className="mr-4">
                <Calendar className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Voting Day</h3>
                <p className="text-muted-foreground">April 25, 2025</p>
                <p className="mt-2">
                  Cast your vote online or in-person at designated polling stations from 8:00 AM to April 26, 2025 8:00 PM.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">Make Your Vote Count</h2>
            <p className="text-xl opacity-90">Shape the future. Arumba Election 2025 - Your Voice, Your Power!</p>
          </div>
        </div>
      </section>
    </div>
  )
}

function PositionCard({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow border-primary">
      <CardContent className="p-6">
        <div className="flex items-start">
          <div className="mr-4 mt-1">{icon}</div>
          <div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

