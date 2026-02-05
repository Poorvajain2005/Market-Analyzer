"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Clock } from "lucide-react";

const mockProjects = [
  {
    title: "AI Fitness App Analysis",
    description: "Market analysis for personalized workout platform",
    timestamp: "2 hours ago",
  },
  {
    title: "SaaS Pricing Strategy",
    description: "Competitive analysis for B2B software",
    timestamp: "1 day ago",
  },
  {
    title: "E-commerce Simulation",
    description: "Market demand forecast",
    timestamp: "3 days ago",
  },
];

export function RecentProjects() {
  return (
    <aside className="w-80 border-l border-border/40 bg-card/30 backdrop-blur-xl">
      <div className="p-6 border-b border-border/40">
        <h2 className="font-semibold text-lg">Recent Projects</h2>
      </div>
      <ScrollArea className="h-[calc(100vh-5rem)]">
        <div className="p-4 space-y-3">
          {mockProjects.map((project, index) => (
            <Card
              key={index}
              className="cursor-pointer border-border/40 bg-background/60 backdrop-blur-sm transition-all hover:shadow-md hover:border-primary/20"
            >
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">
                      {project.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {project.timestamp}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
