import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => (
  <svg
    className={cn("text-primary", className)}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="MarketMind Logo"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2ZM8.27 17l.71-3.59-2.5-2.44 3.6-.52L12 7l1.92 3.45 3.6.52-2.5 2.44.71 3.59L12 15.14 8.27 17Z"
    />
  </svg>
);
