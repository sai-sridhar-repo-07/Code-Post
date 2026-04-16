import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ExternalLink, Calendar, Heart, Eye, LayoutGrid } from "lucide-react";

interface Props {
  params: Promise<{ username: string }>;
}

const THEME_BG: Record<string, string> = {
  minimalist: "linear-gradient(135deg, #0f1117, #1a1d2e)",
  cyberpunk:  "linear-gradient(135deg, #050714, #0a0e27)",
  vintage:    "linear-gradient(135deg, #020b04, #071a07)",
  gradient:   "linear-gradient(135deg, #0f0c29, #1a0a3d)",
  paper:      "linear-gradient(135deg, #fdf6e3, #f0e8d0)",
};

const THEME_DOT: Record<string, string> = {
  minimalist: "#9ca3af",
  cyberpunk:  "#22d3ee",
  vintage:    "#4ade80",
  gradient:   "#a78bfa",
  paper:      "#fbbf24",
};

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      cards: {
        where: { isPublic: true },
        orderBy: { viewCount: "desc" },
        take: 12,
        include: { _count: { select: { likes: true } } },
      },
    },
  });

  if (!user) notFound();

  return (
    <div className="min-h-screen bg-[#05060f] text-white pt-20">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "linear-gradient(rgba(139,92,246,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute top-0 inset-x-0 h-[400px] opacity-[0.06]"
          style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, #8b5cf6, transparent)" }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 py-14">
        {/* Profile header */}
        <div className="flex items-start gap-6 mb-14">
          <div className="relative shrink-0">
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 opacity-40 blur-lg scale-110" />
            <Image
              src={user.avatarUrl}
              alt={user.username}
              width={100}
              height={100}
              className="relative rounded-2xl ring-2 ring-violet-500/30 shadow-2xl"
              unoptimized
            />
          </div>

          <div className="flex-1 pt-1">
            <h1 className="text-3xl font-bold mb-1 text-white">
              {user.name ?? user.username}
            </h1>
            <p className="text-violet-400/80 text-sm font-medium mb-4">@{user.username}</p>
            {user.bio && (
              <p className="text-gray-300 text-sm mb-5 max-w-lg leading-relaxed">{user.bio}</p>
            )}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <Calendar size={12} className="text-gray-600" />
                Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
              <Link
                href={`https://github.com/${user.username}`}
                target="_blank"
                className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 transition-colors"
              >
                <ExternalLink size={12} />
                View on GitHub
              </Link>
            </div>
          </div>
        </div>

        {/* Cards section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
              <LayoutGrid size={15} className="text-violet-400" />
            </div>
            <h2 className="text-lg font-bold text-white">
              Developer Cards
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/6 text-gray-400 border border-white/8">
              {user.cards.length}
            </span>
          </div>

          {user.cards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl glass-card border border-white/8">
              <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
                <LayoutGrid size={22} className="text-violet-400" />
              </div>
              <p className="text-gray-400 text-sm font-medium mb-1">No public cards yet</p>
              <p className="text-gray-600 text-xs">This developer hasn&apos;t shared any cards.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.cards.map((card, i) => {
                const dot = THEME_DOT[card.themeName] ?? "#9ca3af";
                return (
                  <div
                    key={card.id}
                    className="group rounded-2xl glass-card border border-white/8 hover:border-white/20 transition-all duration-300 overflow-hidden"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    {/* Preview */}
                    <div
                      className="h-36 relative overflow-hidden"
                      style={{ background: THEME_BG[card.themeName] ?? THEME_BG.minimalist }}
                    >
                      {/* Dot grid */}
                      <div
                        className="absolute inset-0 opacity-[0.08]"
                        style={{
                          backgroundImage: `radial-gradient(circle, ${dot} 1px, transparent 1px)`,
                          backgroundSize: "18px 18px",
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl opacity-10 select-none font-mono" style={{ color: dot }}>
                          {"</>"}
                        </span>
                      </div>
                      {/* Hover overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-white text-xs font-medium px-3 py-1.5 rounded-lg bg-white/10 border border-white/15">
                          {card.title}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-3.5 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-white truncate max-w-[120px]">{card.title}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: dot }} />
                          <p className="text-[10px] text-gray-500 capitalize">{card.themeName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye size={10} />
                          {card.viewCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart size={10} />
                          {card._count.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: Props) {
  const { username } = await params;
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return {};
  return {
    title: `${user.name ?? user.username} (@${user.username}) — CodePost`,
    description: user.bio ?? `${user.username}'s developer cards on CodePost`,
    openGraph: { images: [user.avatarUrl] },
  };
}
