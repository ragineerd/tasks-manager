import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "SUPER_USER") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // 1. Traer Usuarios
  const users = await prisma.user.findMany({
    select: {
      id: true, email: true, name: true, role: true, createdAt: true,
      _count: { select: { tasks: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  // 2. Traer Todas las Tareas (NUEVO)
  const tasks = await prisma.task.findMany({
    select: {
      id: true, title: true, status: true, createdAt: true, dueDate: true,
      user: { select: { name: true, email: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Devolvemos ambos objetos
  return NextResponse.json({ users, tasks });
}