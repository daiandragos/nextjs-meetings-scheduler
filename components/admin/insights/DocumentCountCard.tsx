"use client";

import { useDocuments } from "@sanity/sdk-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface DocumentCountCardProps {
  documentType: string;
  title: string;
  icon?: LucideIcon;
}

export function DocumentCountCard({
  documentType,
  title,
  icon: Icon,
}: DocumentCountCardProps) {
  const { data: documents } = useDocuments({
    documentType,
  });

  const count = documents?.length ?? 0;

  return (
    <Card className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border-zinc-200/60 shadow-sm hover:shadow hover:-translate-y-0.5 transition-all duration-200 h-full">
      <div className="absolute top-0 right-0 w-24 bg-linear-to-br from-amber-500/10 to-orange-500/5 rounded-bl-full " />
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-zinc-500">
          {title}
        </CardTitle>
        {Icon && (
          <div className="flex size-9 items-center justify-center rounded-lg bg-linear-to-br from-amber-100 to-amber-200 text-amber-700 shadow-sm">
            <Icon className="size-4" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold tracking-tight text-zinc-900">
          {count}
        </p>
      </CardContent>
    </Card>
  );
}
