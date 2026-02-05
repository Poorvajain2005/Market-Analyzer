"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/icons/logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "next-themes";
import {
  MessageSquare,
  Target,
  Lightbulb,
  Bot,
  FileText,
  History,
  Settings,
  Moon,
  Sun,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Market Chat", href: "/dashboard", icon: MessageSquare },
  { name: "Simulations", href: "/simulations", icon: Target },
  { name: "Strategies", href: "/strategies", icon: Lightbulb },
  { name: "Agents", href: "/agents", icon: Bot },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "History", href: "/history", icon: History },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <aside className="flex w-64 flex-col border-r border-border/40 bg-card/30 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border/40 px-6">
        <Logo className="h-7 w-7" />
        <span className="font-headline text-xl font-bold tracking-tight">
          MarketMind
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 rounded-xl px-4 py-3 transition-all hover:bg-accent/50",
                  isActive && "bg-accent text-accent-foreground shadow-sm"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.name}</span>
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-border/40 p-4 space-y-3">
        {/* Settings */}
        <Link href="/settings">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 rounded-xl px-4 py-3 hover:bg-accent/50"
          >
            <Settings className="h-5 w-5" />
            <span className="text-sm font-medium">Settings</span>
          </Button>
        </Link>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-full justify-start gap-3 rounded-xl px-4 py-3 hover:bg-accent/50"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          <span className="text-sm font-medium">
            {theme === "dark" ? "Light" : "Dark"} Mode
          </span>
        </Button>

        {/* User Profile */}
        <div className="flex items-center gap-3 rounded-xl bg-accent/10 p-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.photoURL || ""} />
            <AvatarFallback>
              {user?.displayName?.[0] || user?.email?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.displayName || "User"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => signOut()}
            className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
