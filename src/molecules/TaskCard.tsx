// src/components/TaskCard.tsx
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { GET_TASKS_BY_PROJECT } from "@/utils/graphql/queries/tasks";
import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { FaTrashAlt, FaPenSquare } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import DeleteTaskPopup from "@/molecules/deletePopup";
import EditTaskPopup from "@/molecules/editTaskPopup"; // Importamos el nuevo componente
import { Task, TaskByProject } from "@/types/tasks";

interface TaskCardProps {
  id: string; // ID del proyecto
}

const TaskCard: React.FC<TaskCardProps> = ({ id }) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  const [selectedTaskDelete, setSelectedTaskDelete] = useState<{
    id: string;
    title: string;
  } | null>(null); 
  
  const handleDateFormated = (timestamp: string): string => {
    const date = new Date(Number(timestamp)); // Convertir el timestamp a un objeto Date
  
    // Formatear la fecha como "día mes año, hora:minutos"
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // Formato 24 horas
    }).format(date);
  };

  // Cierra los popups
  const handleClosePopup = () => {
    setSelectedTaskDelete(null);
    setSelectedTask(null);
  };

  const handleTaskDeleted = () => {
    console.log("Tarea eliminada exitosamente");
    refetch(); // Recarga la página después de la eliminación
  };

  // Consulta GraphQL para obtener las tareas del proyecto
  const { data, loading, error, refetch } = useQuery<TaskByProject>(GET_TASKS_BY_PROJECT, {
    variables: { projectId: id },
  });

  console.log(data?.tasksByProject);

  if (loading) return <p>Cargando tareas...</p>;
  if (error) return <p>Error al cargar tareas: {error.message}</p>;

  const tasks = data?.tasksByProject || []; // Evita errores si no hay tareas

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
      {tasks.map((task) => (
        <Card key={task.id} className="bg-slate-200 justify-around">
          <CardHeader>
            <h2 className="text-lg font-bold text-gray-800">{task.title}</h2>
          </CardHeader>
          <div className="p-4">
            <p className="text-gray-600">
              {task.description || "Sin descripción"}
            </p>
            <p className="text-gray-500">
              <strong>Estado:</strong> {task.status || "No especificado"}
            </p>
            <p className="text-gray-500">
              <strong>Fecha límite:</strong>{" "}
              {handleDateFormated(task.dueDate)}
            </p>
            {task.assignee && (
              <p className="text-gray-500">
                <strong>Asignado a:</strong> {task.assignee.name}
              </p>
            )}
          </div>
          <CardFooter className="justify-end flex-col h-1/2">
            <div className="h-full flex flex-col text-center">
              <div className="h-1/2">
                <p className="text-sm text-gray-400">
                  Creado: {handleDateFormated(task.createdAt)}
                </p>
                <p className="text-sm text-gray-400">
                  Actualizado: {handleDateFormated(task.updatedAt)}
                </p>
              </div>

              <div className="flex flex-row h-1/2">
                {/* Botón para abrir el popup de eliminación */}
                <Button
                  className="m-4"
                  onClick={() => setSelectedTaskDelete({
                    id: task.id as unknown as string,
                    title: task.title,
                  })}
                >
                  <FaTrashAlt className="text-red-500 justify-end m-4 w-10 h-10 " />
                </Button>
                {/* Botón para abrir el popup de edición */}
                <Button className="m-4" onClick={() => setSelectedTask(task)}>
                  <FaPenSquare className="text-blue-500 justify-end m-4 w-10 h-10" />
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      ))}

      {/* Mostrar el popup de edición cuando se selecciona una tarea */}
      {selectedTask && (
        <EditTaskPopup
          open={Boolean(selectedTask)}
          task={selectedTask}
          onClose={() => setSelectedTask(null)} // Cerrar el popup
          onTaskUpdated={refetch} // Recargar la página al actualizar
        />
      )}

      {/* Mostrar el popup de eliminación */}
      {selectedTaskDelete && (
        <DeleteTaskPopup
          open={Boolean(selectedTaskDelete)}
          taskId={selectedTaskDelete.id}
          taskTitle={selectedTaskDelete.title}
          onClose={handleClosePopup} // Cerrar el popup
          onTaskDeleted={handleTaskDeleted} // Acción después de la eliminación
        />
      )}
    </div>
  );
};

export default TaskCard;
