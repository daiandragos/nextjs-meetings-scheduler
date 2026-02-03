import Link from "next/link";
import { SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "../ui/button";

export function CTASection() {
  return (
    <section className="bg-blue-500 pyp20 sm: py-24">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to simplify your scheduling?
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Join loads and loads and loads and loads of people who save a lot of
            time using the Meetings Scheduler
          </p>
          <div className="mt-10">
            <SignedOut>
              <SignUpButton mode="modal">
                <Button
                  size="lg"
                  className="
                bg-white text-base text-blue-600 hover:bg-blue-50"
                >
                  Get Started for Free
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Button
                asChild
                size="lg"
                className="bg-white text-base text-blue-600 hover:bg-blue-50"
              >
                <Link href="/availability">Go to Dashboard</Link>
              </Button>
            </SignedIn>
          </div>
        </div>
      </div>
    </section>
  );
}
