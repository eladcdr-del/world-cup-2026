"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface ScoreInputProps {
  value: number | null;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
  max?: number;
}

export function ScoreInput({
  value,
  onChange,
  disabled = false,
  className,
  max = 20,
}: ScoreInputProps) {
  const currentValue = value ?? 0;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={() => onChange(Math.max(0, currentValue - 1))}
        disabled={disabled || currentValue <= 0}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <div
        className={cn(
          "w-10 h-10 flex items-center justify-center rounded-lg text-lg font-bold",
          "bg-muted border border-border",
          disabled && "opacity-50"
        )}
        style={{ direction: "ltr" }}
      >
        {value !== null ? value : "-"}
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={() => onChange(Math.min(max, currentValue + 1))}
        disabled={disabled || currentValue >= max}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}

interface ScoreDisplayProps {
  home: number | null;
  away: number | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ScoreDisplay({ home, away, size = "md", className }: ScoreDisplayProps) {
  const sizeClasses = {
    sm: "text-lg gap-1",
    md: "text-2xl gap-2",
    lg: "text-4xl gap-3",
  };

  return (
    <div
      className={cn(
        "flex items-center font-bold tabular-nums",
        sizeClasses[size],
        className
      )}
      style={{ direction: "ltr", unicodeBidi: "embed" }}
    >
      <span>{home !== null ? home : "-"}</span>
      <span className="text-muted-foreground">:</span>
      <span>{away !== null ? away : "-"}</span>
    </div>
  );
}
