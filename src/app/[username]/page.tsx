import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MapPin, Users, ExternalLink, Calendar } from "lucide-react";

interface Props {
  params: Promise<{ username: string }>;
}

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
    <div className="min-h-screen bg-[#080a14] text-white pt-20">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Profile header */}
        <div className="flex items-start gap-6 mb-12">
          <Image
            src={user.avatarUrl}
            alt={user.username}
            width={96}
            height={96}
            className="rounded-2xl ring-2 ring-white/10"
            unoptimized
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">
              {user.name ?? user.username}
            </h1>
            <p className="text-gray-400 mb-3">@{user.username}</p>
            {user.bio && (
              <p className="text-gray-300 text-sm mb-4 max-w-lg">{user.bio}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar size={13} />
                Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
              <Link
                href={`https://github.com/${user.username}`}
                target="_blank"
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <ExternalLink size={13} />
                GitHub
              </Link>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Developer Cards
            <span className="ml-2 text-sm text-gray-500 font-normal">
              ({user.cards.length})
            </span>
          </h2>

          {user.cards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center border border-white/10 rounded-2xl bg-white/5">
              <p className="text-gray-500 text-sm">No public cards yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.cards.map((card) => (
                <div
                  key={card.id}
                  className="rounded-2xl border border-white/10 bg-white/5 hover:border-white/20 transition-all overflow-hidden"
                >
                  <div
                    className="h-36 flex items-center justify-center"
                    style={{
                      background:
                        card.themeName === "cyberpunk"
                          ? "linear-gradient(135deg, #0a0e27, #1a1f3a)"
                          : card.themeName === "gradient"
                          ? "linear-gradient(135deg, #0f0c29, #24243e)"
                          : card.themeName === "vintage"
                          ? "#0d1117"
                          : card.themeName === "paper"
                          ? "#fdf6e3"
                          : "#f8f9fa",
                    }}
                  >
                    <span className="text-5xl opacity-10 select-none">&lt;/&gt;</span>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-white">{card.title}</p>
                      <p className="text-[10px] text-gray-500 capitalize">{card.themeName} theme</p>
                    </div>
                    <span className="text-[10px] text-gray-500">
                      {card._count.likes} likes
                    </span>
                  </div>
                </div>
              ))}
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
    openGraph: {
      images: [user.avatarUrl],
    },
  };
}
