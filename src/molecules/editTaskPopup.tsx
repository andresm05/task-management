// src/molecules/EditTaskPopup.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@apollo/client";
import { UPDATE_TASK } from "@/utils/graphql/mutations/tasks"; // Asegúrate de tener la mutación de actualización

interface EditTaskPopupProps {
  open: boolean;
  taskId: string;
  taskTitle: string;
  taskDescription: string;
  taskStatus: string;
  taskDueDate: string;
  onClose: () => void;
  onTaskUpdated: () => void;
}

const EditTaskPopup: React.FC<EditTaskPopupProps> = ({
  open,
  taskId,
  taskTitle,
  taskDescription,
  taskStatus,
  taskDueDate,
  onClose,
  onTaskUpdated,
}) => {
  const [title, setTitle] = useState(taskTitle);
  const [description, setDescription] = useState(taskDescription);
  const [status, setStatus] = useState(taskStatus);
  const [dueDate, setDueDate] = useState(taskDueDate);

  const [updateTask, { loading, error }] = useMutation(UPDATE_TASK);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Asegúrate de pasar el ID como `id`, que es lo que la mutación espera
      const { data } = await updateTask({
        variables: {
          id: taskId, // Usamos el ID correcto según la mutación
          title,
          description,
          status,
          dueDate,
        },
      });

      onTaskUpdated(); // Actualiza la tarea
      onClose(); // Cierra el popup
      console.log("Tarea actualizada:", data.updateTask);
    } catch (err) {
      console.error("Error al actualizar tarea:", err);
    }
  };

  if (!open) return null; // Si el popup no está abierto, no se renderiza nada.

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Editar Tarea</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="PENDING">Por hacer</option>
              <option value="IN_PROGRESS">En progreso</option>
              <option value="COMPLETED">Hecho</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Fecha de vencimiento</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="flex justify-between mt-4">
            <Button type="button" onClick={onClose} className="bg-gray-300">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Actualizando..." : "Actualizar Tarea"}
            </Button>
          </div>
        </form>
        {error && <p className="text-red-500 mt-2">{error.message}</p>}
      </div>
    </div>
  );
};

export default EditTaskPopup;
