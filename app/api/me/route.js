import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId, orgId } = await auth();
  return Response.json({ userId, orgId });
}