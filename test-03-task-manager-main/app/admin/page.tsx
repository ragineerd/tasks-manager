"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

// Sub-componentes para organizar el código
import UserTasksTab from "./components/UserTasksTab";
import ConfigTab from "./components/ConfigTab";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"data" | "config">("data");

  // Protección de ruta: Solo SUPER_USER
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user && (session.user as any).role !== "SUPER_USER") {
      router.push("/tasks"); // Redirigir a usuarios normales
    }
  }, [session, status, router]);

  if (status === "loading") return <p className="p-10 text-center">Verificando credenciales...</p>;

  return (
    <div className="min-h-screen bg-zinc-100">
        {/* NUEVO NAV SUPERIOR */}
        <nav className="bg-white border-b border-zinc-200 px-8 py-4 grid grid-cols-3 items-center">
        {/* IZQUIERDA: Botón de volver */}
        <div className="flex justify-start">
            <button 
            onClick={() => router.push("/tasks")}
            className="text-zinc-500 hover:text-blue-600 cursor-pointer flex items-center gap-2"
            >
            <span>←</span> Volver a Tareas
            </button>
        </div>

        {/* CENTRO: Título y Subtítulo */}
        <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold text-zinc-900 leading-tight">
            Panel de Superusuario
            </h1>
            <p className="text-zinc-500 text-sm">
            Control total del sistema y configuración dinámica
            </p>
        </div>

        {/* DERECHA: Usuario y Salir */}
        <div className="flex justify-end items-center gap-4">
            <span className="text-sm text-zinc-500 font-medium">
                {session?.user?.name} {session?.user?.role === "SUPER_USER" ? "(Admin)" : ""}
            </span>
            <button 
            onClick={() => signOut()} 
            className="text-sm text-red-500 hover:font-bold cursor-pointer"
            >
            Salir
            </button>
        </div>
        </nav>
      <main className="max-w-7xl mx-auto p-8">
        {/* Selector de Pestañas */}
        <div className="flex gap-4 mb-8 bg-zinc-200 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("data")}
            className={`px-6 py-2 rounded-md font-medium transition-all cursor-pointer ${
              activeTab === "data" ? "bg-white text-blue-600 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Usuarios y Tareas
          </button>
          <button
            onClick={() => setActiveTab("config")}
            className={`px-6 py-2 rounded-md font-medium transition-all cursor-pointer ${
              activeTab === "config" ? "bg-white text-blue-600 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Configuración Dinámica
          </button>
        </div>

        {/* Contenido Dinámico */}
        <div className="bg-white rounded-2xl shadow-xl border border-zinc-200 p-6">
          {activeTab === "data" ? <UserTasksTab /> : <ConfigTab />}
        </div>
      </main>
    </div>
  );
}