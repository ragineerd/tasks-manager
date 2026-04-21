
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Cambio: Promesa
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "SUPER_USER") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params; // Cambio: Await
    const body = await req.json();

    const updatedField = await prisma.formField.update({
      where: { id },
      data: {
        label: body.label,
        isActive: body.isActive,
        fieldName: body.fieldName,
        type: body.type,
        isRequired: body.isRequired
      },
    });

    return NextResponse.json(updatedField);
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}