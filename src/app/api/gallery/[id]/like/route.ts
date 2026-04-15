import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.cardLike.findUnique({
    where: { cardId_userId: { cardId: id, userId: session.user.id } },
  });

  if (existing) {
    await prisma.cardLike.delete({ where: { id: existing.id } });
    return Response.json({ liked: false });
  } else {
    await prisma.cardLike.create({
      data: { cardId: id, userId: session.user.id },
    });
    return Response.json({ liked: true });
  }
}
