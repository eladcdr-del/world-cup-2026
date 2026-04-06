"use client";

import { useState, useEffect } from "react";
import { getTimeRemaining } from "@/lib/utils/dates";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  deadline: string | Date;
  onExpired?: () => void;
  className?: string;
  variant?: "banner" | "inline" | "compact";
}

export function CountdownTimer({
  deadline,
  onExpired,
  className,
  variant = "banner",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(deadline));

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getTimeRemaining(deadline);
      setTimeLeft(remaining);

      if (remaining.isExpired) {
        onExpired?.();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline, onExpired]);

  if (timeLeft.isExpired) {
    return (
      <div className={cn("text-destructive font-medium text-sm", className)}>
        הזמן להגשה עבר
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-1 text-sm text-muted-foreground", className)}>
        <Clock className="h-3.5 w-3.5" />
        <span>
          {timeLeft.days > 0 && `${timeLeft.days}י `}
          {String(timeLeft.hours).padStart(2, "0")}:
          {String(timeLeft.minutes).padStart(2, "0")}:
          {String(timeLeft.seconds).padStart(2, "0")}
        </span>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <span className={cn("text-sm font-medium", className)}>
        {timeLeft.days > 0 && `${timeLeft.days} ימים, `}
        {timeLeft.hours > 0 && `${timeLeft.hours} שעות, `}
        {timeLeft.minutes} דקות
      </span>
    );
  }

  // Banner variant
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg",
        "bg-primary/10 border border-primary/20",
        className
      )}
    >
      <Clock className="h-4 w-4 text-primary" />
      <span className="text-sm font-medium">זמן שנותר להגשת ניחושים:</span>
      <div className="flex items-center gap-1.5" style={{ direction: "ltr" }}>
        {timeLeft.days > 0 && (
          <TimeUnit value={timeLeft.days} label="ימים" />
        )}
        <TimeUnit value={timeLeft.hours} label="שעות" />
        <TimeUnit value={timeLeft.minutes} label="דקות" />
        <TimeUnit value={timeLeft.seconds} label="שניות" />
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-background rounded px-2 py-0.5 text-lg font-bold tabular-nums min-w-[2.5rem] text-center border">
        {String(value).padStart(2, "0")}
      </div>
      <span className="text-[10px] text-muted-foreground mt-0.5">{label}</span>
    </div>
  );
}
