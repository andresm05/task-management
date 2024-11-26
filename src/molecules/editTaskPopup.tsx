import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_TASK } from "@/utils/graphql/mutations/tasks";
import { Task, TaskStatus } from "@/types/tasks";
import { Dialog } from "@mui/material";
import { handleShowStatus } from "@/utils/helpers";
import useMiddleware from "@/hooks/useMiddleware";
import { AllUsers, Role } from "@/types/users";
import { GET_ALL_USERS_QUERY } from "@/utils/graphql/queries/users";
import IsLoading from "./isLoading";
import { GET_TASKS_BY_PROJECT } from "@/utils/graphql/queries/tasks";
import router, { useRouter } from 'next/router';

interface EditTaskPopupProps {
  open: boolean;
  task: Task;
  setOpen: (open: boolean) => void;
  onTaskUpdated: () => void;
}

const EditTaskPopup: React.FC<EditTaskPopupProps> = ({
  open,
  task: { id, title, description, status, dueDate, assignee },
  setOpen,
  onTaskUpdated,
}) => {

  const user = useMiddleware(Role.USER);
  const [updateTask, {loading, error}] = useMutation(UPDATE_TASK, {
    update(cache, { data: { updateTask } }) {
      cache.modify({
        fields: {
          tasks(existingTasks = []) {
            return existingTasks.map((task: Task) =>
              task.id === updateTask.id ? updateTask : task
            );
          },
        },
      });
    },
  });
  
  const { data, loading:loadingUsers } = useQuery<AllUsers>(GET_ALL_USERS_QUERY);
  const router = useRouter();
  const { id: projectId } = router.query;
  const users = data?.users || [];
  const [isAdmin, setIsAdmin] = useState(false);

  const possibleStatus = ["PENDING", "IN_PROGRESS", "COMPLETED"];

  const filteredUsers = users.filter((user) => user.id !== assignee.id);

  const formatDueDate = (timestamp: string): string => {
    const date = new Date(parseInt(timestamp, 10)); // Asegúrate de convertir el string a número
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Meses van de 0 a 11
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`; // Formato requerido
  };

  useEffect(() => {
    if (user?.role === Role.ADMIN) {
      setIsAdmin(true);
    }
  }, [user]);

  if(loadingUsers) return <IsLoading />;

  //remove the current status from the possible status
  const filteredStatus = possibleStatus.filter((s) => s !== status);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const { newTitle, newDescription, newStatus, newDueDate, newAssignee } = data;
          setOpen(false);


    try {
      const { data } = await updateTask({
        variables: {
          id,
          title: newTitle as string,
          description: newDescription as string,
          status: newStatus as TaskStatus,
          dueDate: new Date(newDueDate as string),
          assigneeId:  newAssignee ? parseInt(newAssignee as string) : null,
        },
        refetchQueries: [
          {
            query: GET_TASKS_BY_PROJECT,
            variables: { projectId },
          },
        ],
        awaitRefetchQueries: true,
      });
      //onTaskUpdated();
      console.log("Tarea actualizada:", data.updateTask);
    } catch (err) {
      console.error("Error al actualizar tarea:", err);
    }
  };


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
              defaultValue={title}
              disabled={!isAdmin} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="newDescription"
              name="newDescription"
              defaultValue={description}
              disabled={!isAdmin}
            />
          </div>
          <div className="space-y-2">
            <select
              name="newAssignee"
              id="newAssignee"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
              disabled={!isAdmin}
            >
              <option value={assignee.id}>{assignee.name}</option>
              {filteredUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <select
              id="newStatus"
              name="newStatus"
              className="w-full p-2 border rounded"
            >
              <option value={status}>{handleShowStatus(status)}</option>
              {filteredStatus.map((status) => (
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
              defaultValue={formatDueDate(dueDate)}
              disabled={!isAdmin}
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

