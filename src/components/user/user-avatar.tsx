'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { type NormalizedUserProfile } from "@/types/user"
import { cn } from "@/lib/features/ui/utils/styles"

interface UserAvatarProps {
  profile?: NormalizedUserProfile | null
  isLoading?: boolean
  className?: string
}

export function UserAvatar({ profile, isLoading, className }: UserAvatarProps) {
  return (
    <Avatar className={cn("h-8 w-8 rounded-lg", className)}>
      {isLoading ? (
        <Skeleton className="h-8 w-8 rounded-lg" />
      ) : (
        <>
          <AvatarImage
            src={profile?.avatar || undefined}
            alt={profile ? `${profile.firstName} ${profile.lastName}` : undefined}
          />
          <AvatarFallback className="rounded-lg">
            {profile ? `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase() : '...'}
          </AvatarFallback>
        </>
      )}
    </Avatar>
  )
} 