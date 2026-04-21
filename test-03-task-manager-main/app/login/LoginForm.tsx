"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const successParam = searchParams.get("success");

  useEffect(() => {
    if (successParam) {
      setShowSuccess(true);

      const timer = setTimeout(() => {
        setShowSuccess(false);
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

        {showSuccess && (
          <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg text-center">
            Cuenta creada. ¡Ya puedes entrar!
          </div>
        )}

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            disabled={loading}
            className="w-full px-4 py-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            required
            disabled={loading}
            className="w-full px-4 py-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-sm text-center">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-blue-600">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}