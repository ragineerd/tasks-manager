import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string()
    .trim()
    .toLowerCase()
    .email({ message: "Formato de correo inválido" }),

  password: z.string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),

  name: z.string()
    .optional()
    .transform(val => val?.trim()),
});

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const validation = registerSchema.safeParse(payload);

    if (!validation.success) {
      // CORRECCIÓN: Usamos .issues en lugar de .errors
      const errorMessage = validation.error.issues[0].message;
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }

    const { email, password, name } = validation.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Este correo ya está registrado" },
        { status: 400 } 
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        // Si tu esquema lo requiere, recuerda que bitAct suele ser 1 por defecto
        role: "USER" // Asegúrate de que coincida con tu lógica de roles
      },
    });

    return NextResponse.json(
      { message: "Cuenta creada exitosamente" },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("[AUTH_REGISTRATION_ERROR]:", error);

    // Error de unicidad de Prisma (aunque ya lo validamos arriba con findUnique)
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "El correo ya está en uso" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Ocurrió un error inesperado" },
      { status: 500 }
    );
  }
}