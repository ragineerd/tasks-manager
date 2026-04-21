import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // UNICA FUENTE DE VERDAD
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Esquema para validar la creación de tareas
const taskSchema = z.object({
  title: z.string().min(1, "El título es obligatorio").max(100),
  description: z.string().optional().nullable(),
  status: z.enum(["pendiente", "en_progreso", "completada"]).default("pendiente"),
  // Ajuste para aceptar el string de datetime-local y convertirlo a Date de JS
  dueDate: z.string()
    .optional()
    .nullable()
    .transform(val => (val && val !== "" ? new Date(val) : null)),
});

// GET: Obtener tareas del usuario
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const tasks = await prisma.task.findMany({
    where: { 
      userId: session.user.id,
      bitAct: 1 // IMPORTANTE: Solo traer las que tienen bit 1
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(tasks);
}

// POST: Crear una nueva tarea
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const body = await req.json();
    const validation = taskSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
    }

    const { title, description, status, dueDate } = validation.data;

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status,
        dueDate,
        userId: session.user.id,
        bitAct: 1, // Aquí se asigna el valor real
      },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("[TASKS_POST_ERROR]:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}