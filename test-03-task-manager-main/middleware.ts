import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdminPage = req.nextUrl.pathname.startsWith("/admin");

    // Si intenta entrar a /admin pero no es SUPER_USER, lo mandamos a /tasks
    if (isAdminPage && token?.role !== "SUPER_USER") {
      return NextResponse.redirect(new URL("/tasks", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/tasks/:path*",
    "/api/tasks/:path*",
    "/admin/:path*", // <-- Agregamos la ruta de admin al matcher
  ],
};