import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const existing = await prisma.card.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const card = await prisma.card.update({
    where: { id },
    data: {
      title: body.title,
      themeName: body.themeName,
      customColors: body.customColors,
      enabledComponents: body.enabledComponents,
      layoutConfig: body.layoutConfig,
      isPublic: body.isPublic,
    },
  });

  return Response.json(card);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.card.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.card.delete({ where: { id } });
  return Response.json({ success: true });
}
