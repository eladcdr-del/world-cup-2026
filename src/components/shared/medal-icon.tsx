import type { MedalType } from "@/lib/types/database";
import { cn } from "@/lib/utils";

const medalStyles: Record<MedalType, { bg: string; border: string; text: string; label: string }> = {
  gold: {
    bg: "bg-yellow-100",
    border: "border-yellow-400",
    text: "text-yellow-700",
    label: "זהב",
  },
  silver: {
    bg: "bg-gray-100",
    border: "border-gray-400",
    text: "text-gray-600",
    label: "כסף",
  },
  bronze: {
    bg: "bg-orange-100",
    border: "border-orange-400",
    text: "text-orange-700",
    label: "ארד",
  },
  aluminum: {
    bg: "bg-blue-50",
    border: "border-blue-300",
    text: "text-blue-500",
    label: "אלומיניום",
  },
  plastic: {
    bg: "bg-gray-50",
    border: "border-gray-200",
    text: "text-gray-400",
    label: "פלסטיק",
  },
};

interface MedalIconProps {
  medal: MedalType;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function MedalIcon({ medal, size = "md", showLabel = false, className }: MedalIconProps) {
  const style = medalStyles[medal];
  const sizeClasses = {
    sm: "w-5 h-5 text-[10px]",
    md: "w-7 h-7 text-xs",
    lg: "w-9 h-9 text-sm",
  };

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div
        className={cn(
          "rounded-full border-2 flex items-center justify-center font-bold",
          style.bg,
          style.border,
          style.text,
          sizeClasses[size]
        )}
      >
        {medal === "gold" && "6"}
        {medal === "silver" && "5"}
        {medal === "bronze" && "4"}
        {medal === "aluminum" && "1"}
        {medal === "plastic" && "0"}
      </div>
      {showLabel && (
        <span className={cn("text-sm", style.text)}>{style.label}</span>
      )}
    </div>
  );
}

interface MedalCountProps {
  gold: number;
  silver: number;
  bronze: number;
  aluminum: number;
  plastic: number;
  compact?: boolean;
}

export function MedalCount({ gold, silver, bronze, aluminum, plastic, compact = false }: MedalCountProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="text-yellow-600 font-semibold">{gold}</span>
        <span className="text-gray-500 font-semibold">{silver}</span>
        <span className="text-orange-600 font-semibold">{bronze}</span>
        <span className="text-blue-400">{aluminum}</span>
        <span className="text-gray-300">{plastic}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {[
        { medal: "gold" as MedalType, count: gold },
        { medal: "silver" as MedalType, count: silver },
        { medal: "bronze" as MedalType, count: bronze },
        { medal: "aluminum" as MedalType, count: aluminum },
        { medal: "plastic" as MedalType, count: plastic },
      ].map(({ medal, count }) => (
        <div key={medal} className="flex items-center gap-1">
          <MedalIcon medal={medal} size="sm" />
          <span className="text-sm font-medium">{count}</span>
        </div>
      ))}
    </div>
  );
}
