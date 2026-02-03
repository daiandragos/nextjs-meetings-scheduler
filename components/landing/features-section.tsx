import {
  Calendar,
  CalendarCheck,
  Clock,
  Globe,
  Video,
  Zap,
} from "lucide-react";

import { FeatureCard } from "./feature-card";
const features = [
  {
    icon: Calendar,
    title: "Smart Availability",
    description:
      "Set your availiability with an intuitive drag-and-drop calendar. Create time blocks visually and let the app handle the rest.",
  },
  {
    icon: Video,
    title: "Google Calendar Sync",
    description:
      "Connect one or more Google accounts to sync busy timeas and prevent double bookings across all your calendars",
  },
  {
    icon: Zap,
    title: "Instant Google Meet",
    description:
      "Join a Google Meet directly from your calendar, as a new meet is created immediately after scheduling a meeting.",
  },
  {
    icon: Clock,
    title: "Flexible Meetings",
    description:
      "Create different meetings with different durations times; quick ones or deeper conversations, as needed.",
  },
  {
    icon: Globe,
    title: "Timezone Compatibillity",
    description:
      "Automatic timezone detection shows guests the availability in their local time. No missed meetings.",
  },
  {
    icon: CalendarCheck,
    title: "Real Time Updates",
    description:
      "Track the meeting status with live feedback. See who accepted, who did not and who is still considering the meeting.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
            Everything you need to manage your schedule
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Amazing features to make scheduling quicker and give you more time
            to focus on what's really important
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
