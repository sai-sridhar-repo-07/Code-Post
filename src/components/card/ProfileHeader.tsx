"use client";

import Image from "next/image";
import { MapPin, Users, Link2 } from "lucide-react";
import type { GitHubUser, Theme } from "@/types";

interface Props {
  user: GitHubUser;
  theme: Theme;
}

export function ProfileHeader({ user, theme }: Props) {
  const { colors, fonts } = theme;

  return (
    <div className="flex items-start gap-4">
      <div
        className="relative shrink-0 rounded-full overflow-hidden"
        style={{ outline: `2px solid ${colors.border}` }}
      >
        <Image
          src={user.avatar_url}
          alt={user.name ?? user.login}
          width={64}
          height={64}
          className="rounded-full"
          unoptimized
        />
      </div>

      <div className="flex-1 min-w-0">
        <h1
          className="font-bold text-xl leading-tight truncate"
          style={{ color: colors.text, fontFamily: fonts.heading }}
        >
          {user.name ?? user.login}
        </h1>
        <p
          className="text-sm font-medium"
          style={{ color: colors.primary, fontFamily: fonts.mono }}
        >
          @{user.login}
        </p>

        {user.bio && (
          <p
            className="text-xs mt-1 line-clamp-2"
            style={{ color: colors.textSecondary }}
          >
            {user.bio}
          </p>
        )}

        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
          {user.location && (
            <span
              className="flex items-center gap-1 text-xs"
              style={{ color: colors.textSecondary }}
            >
              <MapPin size={10} />
              {user.location}
            </span>
          )}
          {user.followers > 0 && (
            <span
              className="flex items-center gap-1 text-xs"
              style={{ color: colors.textSecondary }}
            >
              <Users size={10} />
              {user.followers.toLocaleString()} followers
            </span>
          )}
          <span
            className="flex items-center gap-1 text-xs"
            style={{ color: colors.accent }}
          >
            <Link2 size={10} />
            github.com/{user.login}
          </span>
        </div>
      </div>
    </div>
  );
}
