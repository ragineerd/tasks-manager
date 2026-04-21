"use client";
import { useState, useEffect } from "react";

export default function ConfigTab() {
  const [fields, setFields] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<"TASK_DASHBOARD" | "REGISTER">("TASK_DASHBOARD");
  const [showModal, setShowModal] = useState(false);
  const [newField, setNewField] = useState({ label: "", fieldName: "", type: "text" });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempLabel, setTempLabel] = useState("");
    
  const fetchFields = async () => {
    // Eliminamos "/fields" para que apunte a app/api/config/route.ts
    const res = await fetch(`/api/config?admin=true`); 
    const data = await res.json();
    setFields(Array.isArray(data) ? data : []);
  };

  useEffect(() => { fetchFields(); }, []);

  const saveLabel = async (id: string) => {
    await fetch(`/api/config/fields/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ label: tempLabel }),
      headers: { "Content-Type": "application/json" }
    });
    setEditingId(null);
    fetchFields();
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    await fetch(`/api/config/fields/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ isActive: !currentStatus }),
      headers: { "Content-Type": "application/json" }
    });
    fetchFields();
  };

  const handleCreate = async () => {
    await fetch(`/api/config/fields`, {
      method: "POST",
      body: JSON.stringify({ ...newField, formType: filterType }),
      headers: { "Content-Type": "application/json" }
    });
    setShowModal(false);
    setNewField({ label: "", fieldName: "", type: "text" });
    fetchFields();
  };

  const filteredFields = fields.filter(f => f.formType === filterType);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex bg-zinc-100 p-1 rounded-lg">
          <button 
            onClick={() => setFilterType("TASK_DASHBOARD")}
            className={`px-4 py-1.5 rounded-md text-xs font-bold cursor-pointer transition-all ${filterType === "TASK_DASHBOARD" ? "bg-white shadow-sm text-blue-600" : "text-zinc-500"}`}
          >
            TASK DASHBOARD
          </button>
          {/* <button 
            onClick={() => setFilterType("REGISTER")}
            className={`px-4 py-1.5 rounded-md text-xs font-bold cursor-pointer transition-all ${filterType === "REGISTER" ? "bg-white shadow-sm text-blue-600" : "text-zinc-500"}`}
          >
            REGISTER
          </button> */}
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white  cursor-pointer px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all"
        >
          + Agregar Campo a {filterType}
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-zinc-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-zinc-400 text-[10px] uppercase tracking-widest border-b border-zinc-100">
              <th className="py-4 px-6">Campo Técnico</th>
              <th className="py-4 px-6">Etiqueta (Label)</th>
              <th className="py-4 px-6 text-center">Estado</th>
              <th className="py-4 px-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredFields.map((field) => (
              <tr key={field.id} className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50 transition-colors">
                <td className="py-4 px-6 font-mono text-xs text-zinc-500">
                  {field.fieldName}
                </td>
                
                <td className="py-4 px-6">
                  {editingId === field.id ? (
                    <div className="flex items-center gap-2">
                      <input 
                        className="border border-blue-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full max-w-[200px]"
                        value={tempLabel}
                        onChange={(e) => setTempLabel(e.target.value)}
                        autoFocus
                      />
                      <button 
                        onClick={() => saveLabel(field.id)}
                        className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded font-bold hover:bg-blue-700"
                      >
                        OK
                      </button>
                      <button 
                        onClick={() => setEditingId(null)}
                        className="text-[10px] bg-zinc-200 text-zinc-600 px-2 py-1 rounded font-bold"
                      >
                        X
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center group">
                      <span className="font-medium text-sm text-zinc-700">{field.label}</span>
                      <button 
                        onClick={() => {
                          setEditingId(field.id);
                          setTempLabel(field.label);
                        }}
                        className="ml-2 opacity-0 group-hover:opacity-100 text-[10px] text-blue-500 font-bold hover:underline cursor-pointer"
                      >
                        Editar
                      </button>
                    </div>
                  )}
                </td>

                <td className="py-4 px-6 text-center">
                  <span className={`px-2 py-1 rounded text-[9px] font-black tracking-tighter ${field.isActive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                    {field.isActive ? "ACTIVO" : "INACTIVO"}
                  </span>
                </td>

                <td className="py-4 px-6 text-right space-x-4">
                  <button 
                    onClick={() => toggleStatus(field.id, field.isActive)}
                    className={`text-[11px] font-bold underline underline-offset-4 cursor-pointer ${field.isActive ? "text-zinc-400 hover:text-red-500" : "text-blue-500 hover:text-blue-700"}`}
                  >
                    {field.isActive ? "Desactivar" : "Activar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold mb-4">Nuevo Campo para {filterType}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-400">Etiqueta Visible</label>
                <input 
                  className="w-full border p-2 rounded-lg" 
                  placeholder="Ej: Prioridad" 
                  value={newField.label}
                  onChange={(e) => setNewField({...newField, label: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-400">Nombre Técnico (fieldName)</label>
                <input 
                  className="w-full border p-2 rounded-lg" 
                  placeholder="Ej: priority" 
                  value={newField.fieldName}
                  onChange={(e) => setNewField({...newField, fieldName: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-400">Tipo de Input</label>
                <select 
                  className="w-full border p-2 rounded-lg text-sm"
                  value={newField.type}
                  onChange={(e) => setNewField({...newField, type: e.target.value})}
                >
                  <option value="text">Texto Corto</option>
                  <option value="textarea">Área de Texto</option>
                  <option value="date">Fecha</option>
                  <option value="datetime-local">Fecha y Hora</option>
                  <option value="number">Número</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2 text-zinc-500 font-bold hover:bg-zinc-100 rounded-xl cursor-pointer">Cancelar</button>
              <button onClick={handleCreate} className="flex-1 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 cursor-pointer">Guardar Campo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}