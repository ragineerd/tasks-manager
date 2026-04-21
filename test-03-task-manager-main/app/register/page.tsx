"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      // VALIDACIÓN LOCAL (Antes de ir al servidor)
      if (formData.password.length < 8) {
          setError("La contraseña debe tener al menos 8 caracteres");
          return;
      }

      // Validación de extensiones de correo manual (opcional, el navegador ayuda mucho aquí)
      const emailRegex = /^[^\s@]+@[^\s@]+\.(com|mx|es|com\.mx|net|org)$/i;
      if (!emailRegex.test(formData.email)) {
          setError("Por favor ingresa un correo válido (ej: .com, .mx, .es)");
          return;
      }

      setLoading(true);
      setError("");

      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (!res.ok) {
          // Ahora data.error traerá el mensaje específico del backend
          throw new Error(data.error || "Error al registrarse");
        }

        router.push("/login?success=Account created");
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border border-zinc-200">
        <h1 className="text-2xl font-bold text-center text-zinc-900">Crear cuenta</h1>
        
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700">Nombre Completo</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 mt-1 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 mt-1 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>        
          <div>
            <label className="block text-sm font-medium text-zinc-700">Contraseña</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 mt-1 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <p className="text-sm text-center text-zinc-600">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}