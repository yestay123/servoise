"use client";

import {
  MessageSquare,
  FileText,
  Settings,
  Heart,
  CheckCircle2,
  Star,
  MoreVertical,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type AgentRole = "Customer Support Agent" | "Finance Agent" | "Meeting Agent";

interface AgentProfileCardProps {
  id: number;
  name: string;
  role: AgentRole;
  rating: number;
  reportsCount: number;
  avatar?: string;
  accentColor?: string;
  isFavorite?: boolean;
  onCardClick?: () => void;
  onOpenWorkspace?: () => void;
  onChat?: () => void;
  onReports?: () => void;
  onSettings?: () => void;
  onFavorite?: () => void;
}

const roleAccentColors: Record<AgentRole, string> = {
  "Customer Support Agent": "rgb(139, 92, 246)",
  "Finance Agent": "rgb(34, 197, 94)",
  "Meeting Agent": "rgb(59, 130, 246)",
};

export function AgentProfileCard({
  name,
  role,
  rating,
  reportsCount,
  avatar,
  accentColor,
  isFavorite = false,
  onCardClick,
  onOpenWorkspace,
  onChat,
  onReports,
  onSettings,
  onFavorite,
}: AgentProfileCardProps) {
  const finalAccentColor = accentColor || roleAccentColors[role];
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click if clicking on buttons
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    onCardClick?.();
    onOpenWorkspace?.();
  };

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "group relative flex flex-col p-8 rounded-3xl",
        "bg-gradient-to-b from-card via-card/95 to-card/90",
        "border border-border/40",
        "hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10",
        "transition-all duration-500 cursor-pointer",
        "hover:scale-[1.02] hover:-translate-y-1",
        "backdrop-blur-sm"
      )}
      style={{
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Top Section - Avatar & Identity */}
      <div className="flex flex-col items-center text-center mb-6">
        {/* Large Avatar */}
        <div className="relative mb-4">
          <Avatar
            className={cn(
              "size-24 border-3 transition-all duration-500",
              "group-hover:border-primary/60 group-hover:shadow-2xl",
              "group-hover:shadow-primary/30"
            )}
            style={{
              borderColor: `${finalAccentColor}40`,
            }}
          >
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback
              className="bg-gradient-to-br text-2xl font-bold"
              style={{
                background: `linear-gradient(135deg, ${finalAccentColor}30, ${finalAccentColor}15)`,
                color: finalAccentColor,
              }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
          {/* Glow effect on hover */}
          <div
            className={cn(
              "absolute inset-0 rounded-full opacity-0 group-hover:opacity-40",
              "transition-opacity duration-500 blur-2xl -z-10"
            )}
            style={{
              backgroundColor: finalAccentColor,
            }}
          />
        </div>

        {/* Name with Verification */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <h3 className="text-xl font-bold text-foreground">{name}</h3>
          <CheckCircle2 className="size-5 text-primary shrink-0" />
        </div>

        {/* Role */}
        <p className="text-sm text-muted-foreground font-medium">{role}</p>
      </div>

      {/* Middle Section - Trust Signal */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <Star className="size-4 fill-yellow-500 text-yellow-500" />
        <span className="text-base font-semibold text-foreground">{rating.toFixed(1)}</span>
        <span className="text-sm text-muted-foreground">({reportsCount} reports)</span>
      </div>

      {/* Bottom Section - Primary Action */}
      <div className="flex items-center justify-between gap-3 mt-auto">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onOpenWorkspace?.();
          }}
          className={cn(
            "flex-1 h-11 rounded-xl font-semibold",
            "bg-primary hover:bg-primary/90",
            "shadow-lg shadow-primary/20",
            "hover:shadow-xl hover:shadow-primary/30",
            "transition-all duration-200"
          )}
        >
          Open Workspace
          <ArrowRight className="size-4 ml-2" />
        </Button>

        {/* Secondary Actions Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "size-11 rounded-xl border border-border/40",
                "hover:bg-accent hover:border-border",
                "transition-all duration-200"
              )}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <MoreVertical className="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onChat?.();
            }}>
              <MessageSquare className="size-4 mr-2" />
              <span>Chat</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onReports?.();
            }}>
              <FileText className="size-4 mr-2" />
              <span>View Reports</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onSettings?.();
            }}>
              <Settings className="size-4 mr-2" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onFavorite?.();
            }}>
              <Heart className={cn("size-4 mr-2", isFavorite && "fill-current text-red-500")} />
              <span>{isFavorite ? "Remove Favorite" : "Add to Favorites"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
