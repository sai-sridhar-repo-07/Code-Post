import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProfileCardGrid, ProfileHeader } from "@/components/profile/ProfileCardGrid";

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
    <div className="min-h-screen bg-[#05060f] text-white pt-20">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* 3D perspective grid floor */}
        <div
          className="absolute bottom-0 inset-x-0 h-[50%]"
          style={{
            backgroundImage: "linear-gradient(rgba(139,92,246,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,.08) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            transform: "perspective(500px) rotateX(55deg) translateY(30%)",
            transformOrigin: "50% 100%",
            maskImage: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 60%)",
            WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 60%)",
          }}
        />
        {/* Flat grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "linear-gradient(rgba(139,92,246,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Top radial glow */}
        <div className="absolute top-0 inset-x-0 h-[400px] opacity-[0.08]"
          style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, #8b5cf6, transparent)" }}
        />
        {/* Ambient orbs */}
        <div className="absolute -top-40 -left-20 w-[500px] h-[500px] rounded-full opacity-[0.05] blur-[120px]"
          style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }} />
        <div className="absolute top-1/2 -right-20 w-[400px] h-[400px] rounded-full opacity-[0.04] blur-[100px]"
          style={{ background: "radial-gradient(circle, #38bdf8, transparent)" }} />

        {/* Floating shapes */}
        <div className="absolute top-[20%] left-[4%] w-3 h-3 border border-violet-500/25 rotate-45 float-1" />
        <div className="absolute top-[50%] left-[3%] w-2 h-2 border border-sky-500/20 rounded-full float-2" style={{ animationDelay: "2s" }} />
        <div className="absolute top-[30%] right-[4%] w-3 h-3 border border-pink-500/20 rotate-45 float-3" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 py-14">
        <ProfileHeader user={user} />
        <ProfileCardGrid user={user} />
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
