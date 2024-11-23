import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@apollo/client";
import { UPDATE_TASK } from "@/utils/graphql/mutations/tasks";
import { Task, TaskStatus } from "@/types/tasks";
import { Dialog } from "@mui/material";
import { handleShowStatus } from "@/utils/helpers";

interface EditTaskPopupProps {
  open: boolean;
  task: Task;
  setOpen: (open: boolean) => void;
  onTaskUpdated: () => void;
}

const EditTaskPopup: React.FC<EditTaskPopupProps> = ({
  open,
  task: { id, title, description, status, dueDate },
  setOpen,
  onTaskUpdated,
}) => {


  const [updateTask, { loading, error }] = useMutation(UPDATE_TASK);

  const possobleStatus = ["PENDING", "IN_PROGRESS", "COMPLETED"];

  //remove the current status from the possible status
  const statusIndex = possobleStatus.indexOf(status);
  possobleStatus.splice(statusIndex, 1);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const { newTitle, newDescription, newStatus, newDueDate } = data;


    try {
      const { data } = await updateTask({
        variables: {
          id,
          title: newTitle as string,
          description: newDescription as string,
          status: newStatus as TaskStatus,
          dueDate: new Date(newDueDate as string),
        },
      });

      onTaskUpdated();
      setOpen(false);
      console.log("Tarea actualizada:", data.updateTask);
    } catch (err) {
      console.error("Error al actualizar tarea:", err);
    }
  };

  if (!open) return null;

  return (
    <Dialog
    open={open}
    onClose={() => setOpen(false)}
    >
      <div className="bg-white p-8 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Editar Tarea</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="newTitle"
              name="newTitle"
              defaultValue={title} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="newDescription"
              name="newDescription"
              defaultValue={description} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <select
              id="newStatus"
              name="newStatus"
              className="w-full p-2 border rounded"
            >
              <option value={status}>{handleShowStatus(status)}</option>
              {possobleStatus.map((status) => (
                <option key={status} value={status}>
                  {handleShowStatus(status as TaskStatus)}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Fecha de vencimiento</Label>
            <Input
              id="newDueDate"
              type="datetime-local"
              name="newDueDate"
              defaultValue={dueDate}
            />
          </div>
          <div className="flex justify-between mt-4">
            <Button type="button" onClick={() => setOpen(false)} className="bg-gray-300">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Actualizando..." : "Actualizar Tarea"}
            </Button>
          </div>
        </form>
        {error && <p className="text-red-500 mt-2">{error.message}</p>}
      </div>
    </Dialog>
  );
};

export default EditTaskPopup;

