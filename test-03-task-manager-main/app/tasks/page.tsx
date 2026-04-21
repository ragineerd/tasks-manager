"use client";

import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  dueDate: string | null;
}

interface FormField {
  id: string;
  fieldName: string;
  label: string;
  type: string;
  isActive: boolean;
}

export default function TasksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [formConfig, setFormConfig] = useState<FormField[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados del formulario
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [dismissedTasks, setDismissedTasks] = useState<Record<string, number>>({});

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const closeModal = () => setSelectedTask(null);

  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [configLoading, setConfigLoading] = useState(true);

  const fetchData = async () => {
  try {
    setLoading(true);
    const [tasksRes, configRes] = await Promise.all([
      fetch("/api/tasks"),
      // Usamos ?type= para filtrar en la API
      fetch("/api/config/fields?type=TASK_DASHBOARD") 
    ]);

    const tasksData = tasksRes.ok ? await tasksRes.json() : [];
    const configData = configRes.ok ? await configRes.json() : [];

    setTasks(Array.isArray(tasksData) ? tasksData : []);
    setFormConfig(Array.isArray(configData) ? configData : []);

    // Inicializar los valores del formulario para evitar errores de undefined
    const initialValues: Record<string, string> = {};
    configData.forEach((f: FormField) => initialValues[f.fieldName] = "");
    setFormValues(initialValues);

  } catch (err) {
    console.error("Error cargando datos", err);
  } finally {
    setLoading(false);
    setConfigLoading(false);
  }
};

  useEffect(() => {
    if (status === "authenticated") fetchData();
  }, [status]);

  // Guardián de Tareas: Revisa expiración y limpia alertas "dismissed"
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      // 1. Log de advertencia (opcional)
      tasks.forEach(task => {
        if (task.dueDate && task.status !== "completada" && new Date(task.dueDate).getTime() <= now) {
          console.warn(`URGENTE: ${task.title} ha expirado.`);
        }
      });

      // 2. Limpiar estados de "alertas cerradas" cada 30 min
      setDismissedTasks(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(id => {
          if (now - updated[id] > 1800000) delete updated[id];
        });
        return updated;
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [tasks]);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica: El título (fieldName='title') debe existir
    if (!formValues['title']?.trim()) return;

    const res = await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify(formValues), // Enviamos todo el objeto dinámico
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      // Limpiar el formulario
      const clearedValues: Record<string, string> = {};
      formConfig.forEach(f => clearedValues[f.fieldName] = "");
      setFormValues(clearedValues);
      fetchData(); // Recargar tareas
    }
  };

  const toggleTask = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "completada" ? "pendiente" : "completada";
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: newStatus }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) fetchData();
  };

  const deleteTask = async (id: string) => {
    if (!confirm("¿Borrar esta tarea?")) return;
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (res.ok) fetchData();
  };

  if (status === "loading") return <p className="p-10 text-center">Cargando...</p>;

  // Helpers para encontrar etiquetas dinámicas
  const getLabel = (fieldName: string) => formConfig.find(f => f.fieldName === fieldName)?.label || fieldName;

  return (
    <div className="min-h-screen bg-zinc-50">
      <nav className="bg-white border-b border-zinc-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-zinc-800">Gestor de Tareas</h1>
          {(session?.user as any)?.role === "SUPER_USER" && (
            <button 
              onClick={() => router.push("/admin")}
              className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors cursor-pointer"
            >
              MODO ADMINISTRADOR
            </button>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-500 font-medium">{session?.user?.name}</span>
          <button onClick={() => signOut()} className="text-sm text-red-500 hover:font-bold cursor-pointer">Salir</button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-6 space-y-8">
        {/* FORMULARIO DINÁMICO */}
        <form onSubmit={addTask} className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 space-y-4">
          {configLoading ? (
            <p className="text-center text-xs text-zinc-400">Cargando campos...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formConfig.filter(f => f.type !== "textarea").map(field => (
                  <div key={field.id} className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{field.label}</label>
                    <input
                      type={field.type}
                      className="px-4 py-2 rounded-lg border border-zinc-200 focus:border-blue-500 outline-none transition-all"
                      value={formValues[field.fieldName] || ""}
                      onChange={(e) => setFormValues(prev => ({...prev, [field.fieldName]: e.target.value}))}
                      placeholder={`Ingrese ${field.label.toLowerCase()}...`}
                    />
                  </div>
                ))}
              </div>
              
              {/* Textarea dinámico */}
              {formConfig.filter(f => f.type === "textarea").map(field => (
                <div key={field.id} className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{field.label}</label>
                  <textarea
                    className="px-4 py-2 rounded-lg border border-zinc-200 focus:border-blue-500 outline-none resize-none h-20"
                    value={formValues[field.fieldName] || ""}
                    onChange={(e) => setFormValues(prev => ({...prev, [field.fieldName]: e.target.value}))}
                  />
                </div>
              ))}
            </>
          )}
          
          <button type="submit" className="w-full bg-zinc-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-all cursor-pointer">
            Guardar Tarea
          </button>
        </form>

        {/* LISTA DE TAREAS DINÁMICA */}
        <div className="space-y-3">
          {tasks.map((task) => {
            const isExpired = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completada';
            const isDismissed = !!dismissedTasks[task.id];

            return (
              <div key={task.id} className="relative group">
                {isExpired && !isDismissed && (
                  <div 
                    onClick={() => setDismissedTasks(prev => ({ ...prev, [task.id]: Date.now() }))}
                    className="absolute inset-0 z-20 bg-red-500/5 backdrop-blur-[1px] rounded-xl border-2 border-red-500 flex items-center justify-center cursor-pointer animate-pulse"
                  >
                    <span className="bg-red-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase">¡Atención Requerida!</span>
                  </div>
                )}

                <div 
                  onClick={() => !isExpired || isDismissed ? setSelectedTask(task) : null}
                  className={`bg-white p-4 rounded-xl border flex items-center justify-between transition-all ${isExpired && !isDismissed ? 'opacity-30' : 'opacity-100 border-zinc-200 shadow-sm hover:border-blue-200'}`}>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => toggleTask(task.id, task.status)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${task.status === 'completada' ? 'bg-green-500 border-green-500 text-white' : 'border-zinc-300'}`}
                    >
                      {task.status === 'completada' && "✓"}
                    </button>
                    <div>
                      <h3 className={`text-sm font-bold ${task.status === 'completada' ? 'text-zinc-300 line-through' : 'text-zinc-800'}`}>
                        {task.title}
                      </h3>
                      <p className="text-xs text-zinc-400">{task.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-right">
                    <div className="hidden sm:block">
                      <p className="text-[9px] font-black text-zinc-300 uppercase">{getLabel("dueDate")}</p>
                      <p className={`text-[10px] font-medium ${isExpired ? 'text-red-600' : 'text-zinc-500'}`}>
                        {task.dueDate ? new Date(task.dueDate).toLocaleString() : '---'}
                      </p>
                    </div>
                    <button onClick={() => deleteTask(task.id)} className="text-zinc-300 hover:text-red-500 transition-colors">✕</button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* MODAL DE DETALLE DINÁMICO */}
          {selectedTask && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm">
              <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Encabezado del Modal */}
                <div className="p-6 border-b border-zinc-100 flex justify-between items-start">
                  <div>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider ${selectedTask.status === 'completada' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                      {selectedTask.status}
                    </span>
                    <h2 className="text-xl font-bold text-zinc-800 mt-2">{selectedTask.title}</h2>
                  </div>
                  <button onClick={closeModal} className="text-zinc-400 hover:text-zinc-800 p-2 text-xl">✕</button>
                </div>

                {/* Cuerpo del Modal - AQUÍ SE MUESTRAN TODOS LOS CAMPOS DINÁMICOS */}
                <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                  {formConfig.map((field) => {
                    // Obtenemos el valor de la tarea para este campo técnico
                    const value = (selectedTask as any)[field.fieldName];
                    
                    return (
                      <div key={field.id} className="space-y-1">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{field.label}</p>
                        <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                          {field.type === "datetime-local" ? (
                            <p className="text-sm font-medium text-zinc-700">
                              {value ? new Date(value).toLocaleString() : "Sin fecha"}
                            </p>
                          ) : (
                            <p className="text-sm font-medium text-zinc-700 whitespace-pre-wrap">
                              {value || "---"}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Acciones del Modal */}
                <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex gap-3">
                  <button 
                    onClick={() => {
                      toggleTask(selectedTask.id, selectedTask.status);
                      closeModal();
                    }}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm cursor-pointer transition-all ${
                      selectedTask.status === 'completada' 
                      ? 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300' 
                      : 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200'
                    }`}
                  >
                    {selectedTask.status === 'completada' ? "Marcar como Pendiente" : "Marcar como Completada"}
                  </button>
                  <button 
                    onClick={closeModal}
                    className="px-6 py-3 border border-zinc-200 cursor-pointer text-zinc-500 font-bold text-sm rounded-xl hover:bg-white transition-all"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}