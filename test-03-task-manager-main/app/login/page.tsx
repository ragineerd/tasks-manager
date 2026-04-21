"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react"; // Añadimos useEffect
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Nuevo estado para controlar la visibilidad del mensaje de éxito
  const [showSuccess, setShowSuccess] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const successParam = searchParams.get("success");

  // Efecto para manejar el mensaje de éxito
  useEffect(() => {
    if (successParam) {
      setShowSuccess(true);

      // Timer para ocultar el mensaje después de 3 segundos
      const timer = setTimeout(() => {
        setShowSuccess(false);
        // Limpiamos la URL quitando el parámetro ?success sin recargar la página
        router.replace("/login");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successParam, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email: email.toLowerCase().trim(),
      password,
      redirect: false,
    });

    if (!result || result.error) {
      setError("Credenciales inválidas");
      setPassword("");
      setLoading(false);
      return;
    } else {
      setLoading(false);
      router.push("/tasks");
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border border-zinc-200">
        <h1 className="text-2xl font-bold text-center text-zinc-900">Iniciar Sesión</h1>

        {/* Usamos el estado showSuccess en lugar del parámetro directo */}
        {showSuccess && (
          <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg text-center animate-in fade-in duration-500">
            Cuenta creada. ¡Ya puedes entrar!
          </div>
        )}

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg text-center animate-in shake-1">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700">Email</label>
            <input
              type="email"
              required
              disabled={loading}
              className="w-full px-4 py-2 mt-1 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">Contraseña</label>
            <input
              type="password"
              required
              disabled={loading}
              className="w-full px-4 py-2 mt-1 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-sm text-center text-zinc-600">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}