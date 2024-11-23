// src/molecules/EditTaskPopup.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@apollo/client";
import { UPDATE_TASK } from "@/utils/graphql/mutations/tasks"; // Asegúrate de tener la mutación de actualización
import { Task } from "@/types/tasks";

interface EditTaskPopupProps {
  open: boolean;
  task: Task;
  onClose: () => void;
  onTaskUpdated: () => void;
}

const EditTaskPopup: React.FC<EditTaskPopupProps> = ({
  open,
  task: { id, title, description, status, dueDate},
  onClose,
  onTaskUpdated,
}) => {

  const [updateTask, { loading, error }] = useMutation(UPDATE_TASK);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    const newtitle = data.title as string;
    const newDescription = data.description as string;
    const neStatus = data.status;
    const NewdueDate = new Date(data.dueDate as string);

    try {
      // Asegúrate de pasar el ID como `id`, que es lo que la mutación espera
      const { data } = await updateTask({
        variables: {
          newtitle,
          newDescription,
          neStatus,
          NewdueDate,
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
            name="title"
            value={title as string}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              value={description as string}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <select
              id="status"
              name="status"
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
              type="datetime-local"
              name="dueDate"
              value={dueDate}
            />
          </div>
          <div className="flex justify-between mt-4">
            <Button type="submit" onClick={onClose} className="bg-gray-300">
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
