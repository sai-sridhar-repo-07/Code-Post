import { auth } from "@/lib/auth";
import { fetchGitHubData } from "@/lib/github";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.accessToken || !session.user.username) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await fetchGitHubData(
      session.user.accessToken,
      session.user.username
    );

    // Update lastSynced
    await prisma.user.update({
      where: { id: session.user.id },
      data: { lastSynced: new Date() },
    });

    return Response.json(data);
  } catch (error) {
    console.error("GitHub stats fetch error:", error);
    return Response.json(
      { error: "Failed to fetch GitHub data" },
      { status: 500 }
    );
  }
}
