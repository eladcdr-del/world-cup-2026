import { cn } from "@/lib/utils";
import Image from "next/image";

interface TeamBadgeProps {
  name: string;
  flagUrl: string;
  shortCode?: string;
  size?: "sm" | "md" | "lg";
  reverse?: boolean;
  className?: string;
}

export function TeamBadge({
  name,
  flagUrl,
  shortCode,
  size = "md",
  reverse = false,
  className,
}: TeamBadgeProps) {
  const flagSizes = {
    sm: { width: 20, height: 15 },
    md: { width: 32, height: 24 },
    lg: { width: 48, height: 36 },
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const flag = flagSizes[size];

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        reverse && "flex-row-reverse",
        className
      )}
    >
      <div className="rounded-sm overflow-hidden border border-border/50 shadow-sm flex-shrink-0">
        <Image
          src={flagUrl}
          alt={name}
          width={flag.width}
          height={flag.height}
          className="object-cover"
        />
      </div>
      <span className={cn("font-medium", textSizes[size])}>{name}</span>
      {shortCode && (
        <span className="text-xs text-muted-foreground">({shortCode})</span>
      )}
    </div>
  );
}

interface TeamFlagProps {
  flagUrl: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function TeamFlag({ flagUrl, name, size = "md", className }: TeamFlagProps) {
  const sizes = {
    sm: { width: 20, height: 15 },
    md: { width: 32, height: 24 },
    lg: { width: 48, height: 36 },
    xl: { width: 64, height: 48 },
  };

  const s = sizes[size];

  return (
    <div className={cn("rounded-sm overflow-hidden border border-border/50 shadow-sm", className)}>
      <Image
        src={flagUrl}
        alt={name}
        width={s.width}
        height={s.height}
        className="object-cover"
      />
    </div>
  );
}
