import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH: Actualizar estado de la tarea
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { status } = await req.json();

    const updatedTask = await prisma.task.update({
      where: { id: id, userId: session.user.id },
      data: { status },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

// DELETE: Eliminar tarea
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    // CAMBIO CLAVE: Usamos .update() en lugar de .delete()
    await prisma.task.update({
      where: { id: id, userId: session.user.id },
      data: { bitAct: 0 }, // Aquí desactivamos el bit
    });

    return NextResponse.json({ message: "Tarea enviada al historial (bitAct: 0)" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}