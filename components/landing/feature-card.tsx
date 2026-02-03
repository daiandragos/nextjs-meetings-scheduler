import type { LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <Card className="border-zinc-200 transition-shadow hover:shadow-lg dark:border-zinc-800">
      <CardHeader>
        <div className="mb-2 flex size-12 items-center justify-center rounded-lg bg-blue-500/10">
          <Icon className="size-6 text-blue-500" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="-mt-2">
        <CardDescription className="">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
