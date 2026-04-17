import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await auth();
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "12");
  const theme = searchParams.get("theme");
  const search = searchParams.get("search")?.trim();

  const where = {
    isPublic: true,
    ...(theme ? { themeName: theme } : {}),
    ...(search
      ? {
          OR: [
            { user: { username: { contains: search, mode: "insensitive" as const } } },
            { user: { name: { contains: search, mode: "insensitive" as const } } },
            { title: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const userId = session?.user?.id;

  const [cards, total] = await Promise.all([
    prisma.card.findMany({
      where,
      orderBy: [{ viewCount: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          select: { username: true, avatarUrl: true, name: true },
        },
        _count: { select: { likes: true } },
        ...(userId
          ? { likes: { where: { userId }, select: { id: true } } }
          : {}),
      },
    }),
    prisma.card.count({ where }),
  ]);

  return Response.json({
    cards: cards.map((card) => {
      const cardWithLikes = card as typeof card & { likes?: { id: string }[] };
      return {
        ...card,
        likeCount: card._count.likes,
        isLiked: userId ? (cardWithLikes.likes?.length ?? 0) > 0 : false,
      };
    }),
    total,
    pages: Math.ceil(total / limit),
    page,
  });
}
