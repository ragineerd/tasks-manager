"use client";
import { useState, useEffect } from "react";

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
  _count: { tasks: number };
}

interface AdminTask {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  dueDate: string | null;
  user: { name: string | null; email: string };
}

export default function UserTasksTab() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [view, setView] = useState<"users" | "tasks">("users");
  const [loading, setLoading] = useState(true);

  // Estado para la hora actual y validar expiración en tiempo real
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000); // Actualiza cada minuto
    return () => clearInterval(timer);
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/data", { cache: 'no-store' });
      const data = await res.json();
      
      if (data.users) setUsers(data.users);
      if (data.tasks) setTasks(data.tasks);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAdminData(); }, []);

  if (loading) return <p className="text-center p-10 text-zinc-500">Cargando base de datos...</p>;

  const totalTasks = users.reduce((sum, u) => sum + u._count.tasks, 0);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold border-b pb-4">Visualización de Datos Globales</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={() => setView("users")}
          className={`p-5 rounded-xl border transition-all text-left cursor-pointer ${
            view === "users" 
            ? "bg-blue-50 border-blue-200 ring-2 ring-blue-500/10" 
            : "bg-zinc-50 border-zinc-100 hover:bg-zinc-100"
          }`}
        >
          <p className={`text-xs uppercase font-bold ${view === "users" ? "text-blue-600" : "text-zinc-400"}`}>
            Total Usuarios
          </p>
          <p className="text-3xl font-black text-zinc-900">{users.length}</p>
          <p className="text-[10px] text-zinc-500 mt-1">{view === "users" ? "● Viendo ahora" : "Click para ver detalles"}</p>
        </button>

        <button 
          onClick={() => setView("tasks")}
          className={`p-5 rounded-xl border transition-all text-left cursor-pointer ${
            view === "tasks" 
            ? "bg-blue-50 border-blue-200 ring-2 ring-blue-500/10" 
            : "bg-zinc-50 border-zinc-100 hover:bg-zinc-100"
          }`}
        >
          <p className={`text-xs uppercase font-bold ${view === "tasks" ? "text-blue-600" : "text-zinc-400"}`}>
            Total Tareas Creadas
          </p>
          <p className="text-3xl font-black text-zinc-900">{totalTasks}</p>
          <p className="text-[10px] text-zinc-500 mt-1">{view === "tasks" ? "● Viendo ahora" : "Click para ver detalles"}</p>
        </button>
      </div>

      <div className="overflow-x-auto">
        {view === "users" ? (
          <table className="w-full text-left animate-in fade-in duration-500">
            <thead>
              <tr className="text-zinc-400 text-xs uppercase tracking-wider border-b">
                <th className="py-3 px-4">Usuario</th>
                <th className="py-3 px-4">Rol</th>
                <th className="py-3 px-4">Tareas</th>
                <th className="py-3 px-4">Registro</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                  <td className="py-4 px-4">
                    <p className="font-medium text-zinc-800">{user.name || 'Sin Nombre'}</p>
                    <p className="text-xs text-zinc-500">{user.email}</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${user.role === 'SUPER_USER' ? 'bg-purple-100 text-purple-700' : 'bg-zinc-100 text-zinc-600'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-blue-600">{user._count.tasks}</td>
                  <td className="py-4 px-4 text-xs text-zinc-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left animate-in fade-in duration-500">
            <thead>
              <tr className="text-zinc-400 text-xs uppercase tracking-wider border-b">
                <th className="py-3 px-4">Tarea</th>
                <th className="py-3 px-4">Usuario</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4">Fecha Creación</th>
                <th className="py-3 px-4">Fecha Finalización</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => {
                // LOGICA DE EXPIRACIÓN
                const isExpired = task.dueDate && new Date(task.dueDate) < now && task.status !== 'completada';

                return (
                  <tr key={task.id} className={`border-b border-zinc-100 hover:bg-zinc-50 transition-colors ${isExpired ? 'bg-red-50/30' : ''}`}>
                    <td className="py-4 px-4">
                      <p className={`font-medium ${isExpired ? 'text-red-700' : 'text-zinc-800'}`}>{task.title}</p>
                      {isExpired && <p className="text-[9px] font-black text-red-500 uppercase tracking-tighter">Expirada para el usuario</p>}
                    </td>
                    <td className="py-4 px-4 text-xs text-zinc-500">
                      {task.user.name || task.user.email}
                    </td>
                    <td className="py-4 px-4">
                      {isExpired ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white animate-pulse">
                          VENCIDA
                        </span>
                      ) : (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${task.status === 'completada' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {task.status.toUpperCase()}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-xs text-zinc-500">
                      {new Date(task.createdAt).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-xs">
                      {task.dueDate ? (
                          <span className={`font-medium ${isExpired ? 'text-red-600' : 'text-zinc-600'}`}>
                          {new Date(task.dueDate).toLocaleString()}
                          </span>
                      ) : (
                          <span className="text-zinc-300 italic">Sin fecha</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}