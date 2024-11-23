// src/components/TaskCard.tsx
import { GET_TASKS_BY_PROJECT } from "@/utils/graphql/queries/tasks";
import { useQuery } from "@apollo/client";
import React, { useState } from "react";

import { Task, TaskByProject } from "@/types/tasks";
import { TaskCard } from "./TaskCard";

interface TaskDataProps {
  id: string; // ID del proyecto
}

const TaskData: React.FC<TaskDataProps> = ({ id }) => {

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
        <TaskCard key={task.id} task={task} refetch={refetch} />
      ))}

    </div>
  );
};

export default TaskData;
