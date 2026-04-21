"use client";

import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Cargando...</div>}>
      <LoginForm />
    </Suspense>
  );
}