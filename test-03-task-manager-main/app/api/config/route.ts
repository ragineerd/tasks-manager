
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isAdminRequest = searchParams.get("admin") === "true";

  const session = await getServerSession(authOptions);
  const isSuperUser = (session?.user as any)?.role === "SUPER_USER";

  const fields = await prisma.formField.findMany({
    where: isAdminRequest && isSuperUser ? {} : { isActive: true },
    orderBy: { order: 'asc' }
  });

  return NextResponse.json(fields);
}