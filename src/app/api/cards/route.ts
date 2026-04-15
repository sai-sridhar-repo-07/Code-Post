import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cards = await prisma.card.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { likes: true } },
    },
  });

  return Response.json(cards);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const card = await prisma.card.create({
    data: {
      userId: session.user.id,
      title: body.title ?? "My Developer Card",
      themeName: body.themeName ?? "minimalist",
      customColors: body.customColors ?? {},
      enabledComponents: body.enabledComponents ?? {},
      layoutConfig: body.layoutConfig ?? {},
      isPublic: body.isPublic ?? true,
    },
  });

  return Response.json(card, { status: 201 });
}
