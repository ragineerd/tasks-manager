export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Ragineer — Task Manager</h1>
      <a 
        href="https://tasks-manager-sand-nine.vercel.app/login" 
        className="mt-4 text-lg text-zinc-500 hover:text-zinc-800 underline transition-colors"
      >
        INICIAR SESION
      </a>
    </main>
  );
}
