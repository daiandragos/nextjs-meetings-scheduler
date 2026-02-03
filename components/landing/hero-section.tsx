import Link from "next/link";
import { Sparkles } from "lucide-react";
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { HeroVisual } from "./hero-visual";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%, rgba(59,130,246,0.12),transparent)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
            <Sparkles className="size-4" />
            Meeting scheduling made simple
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-6xl dark:text-white">
            Schedule meetings{" "}
            <span className="text-blue-500">quicker and simpler than ever</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Meetings Scheduler connects to Google Calendar, shows your
            availability and lets anyone book time with you instantly. No
            e-mails or other back and forth communication required anymore.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <SignedOut>
              <SignUpButton mode="modal">
                <Button
                  size="lg"
                  className="w-full bg-blue-500 text-base hover:bg-blue-600 sm:w-auto"
                >
                  Start Scheduling for Free
                </Button>
              </SignUpButton>
              <SignInButton mode="modal">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-base"
                >
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Button
                asChild
                size="lg"
                className="w-full bg-blue-500 text-base hover:bg-blue-600 sm:w-auto"
              >
                <Link href="/availability">Go to Dashboard</Link>
              </Button>
            </SignedIn>
          </div>
        </div>
        <HeroVisual />
      </div>
    </section>
  );
}
