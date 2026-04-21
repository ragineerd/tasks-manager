import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; 

// --- FUNCIÓN GET (La que ya tienes) ---
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); 
  const isAdminRequest = searchParams.get("admin") === "true";

  const session = await getServerSession(authOptions);
  const isSuperUser = (session?.user as any)?.role === "SUPER_USER";

  const fields = await prisma.formField.findMany({
    where: { 
      ...(type ? { formType: type } : {}),
      ...(isAdminRequest && isSuperUser ? {} : { isActive: true })
    },
    orderBy: { order: 'asc' }
  });

  return NextResponse.json(fields);
}


export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    //  Seguridad
    if (!session || (session.user as any).role !== "SUPER_USER") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { formType, fieldName, label, type } = body;

    //  Validación CRÍTICA
    if (!/^[a-z0-9_]{1,25}$/.test(fieldName)) {
      return NextResponse.json({
        error: "Nombre técnico inválido. Usa minúsculas, números y _"
      }, { status: 400 });
    }

    //  Mapear tipo a SQL
    const getSqlType = (inputType: string) => {
      switch (inputType) {
        case "number": return "REAL";
        default: return "TEXT";
      }
    };

    const targetTable = formType === "TASK_DASHBOARD" ? "Task" : "User";
    const sqlType = getSqlType(type);

    //  ALTER TABLE (sincronización real)
    try {
      await prisma.$executeRawUnsafe(
        `ALTER TABLE ${targetTable} ADD COLUMN ${fieldName} ${sqlType}`
      );
    } catch (sqlError: any) {
      console.warn("⚠️ Columna ya existe o error SQL:", sqlError.message);
    }

    //  UPSERT (evita duplicados)
    const newField = await prisma.formField.upsert({
      where: {
        formType_fieldName: { formType, fieldName }
      },
      update: {
        label,
        type,
        isActive: true
      },
      create: {
        formType,
        fieldName,
        label,
        type,
        isActive: true,
        order: 0
      }
    });

    return NextResponse.json(newField, { status: 201 });

  } catch (error: any) {
    console.error("[FIELDS_POST_ERROR]:", error);
    return NextResponse.json(
      { error: "Error al crear campo dinámico" },
      { status: 500 }
    );
  }
}