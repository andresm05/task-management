import { GET_TASKS_BY_PROJECT } from "@/utils/graphql/queries/tasks";
import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";

import { Task, TaskByProject } from "@/types/tasks";
import { TaskCard } from "./taskCard";
import useMiddleware from "@/hooks/useMiddleware";
import { Role } from "@/types/users";
import { Alert } from "@mui/material";

interface TaskDataProps {
  id: string; // ID del proyecto
}

const TaskData: React.FC<TaskDataProps> = ({ id }) => {
  const user = useMiddleware(Role.USER);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  // Consulta GraphQL para obtener las tareas del proyecto
  const { data, loading, error } = useQuery<TaskByProject>(GET_TASKS_BY_PROJECT, {
    variables: { projectId: id },
  });

  useEffect(() => {
    // Reacciona a los cambios en `tasks` o `user`
    if (user?.role === Role.USER && data?.tasksByProject) {
      const userTasks = data.tasksByProject.filter((task) => task.assignee?.id === user.id);
      setFilteredTasks(userTasks);
      console.log(userTasks);
    }
  }, [data]);

  if (loading) return <p>Cargando tareas...</p>;
  if (error) return <p>Error al cargar tareas: {error.message}</p>;

  const tasks = data?.tasksByProject || []; // Evita errores si no hay tareas

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
      {user?.role === Role.USER &&
        (<>
          {filteredTasks.length === 0 ? (
            <Alert severity="info">No tienes tareas asignadas</Alert>
          ) :
            <>
              {filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </>
          }

        </>
        )}
      {user?.role === Role.ADMIN &&
         (<>
          {tasks.length === 0 ? (
            <Alert severity="info">Aún no hay tareas para este Proyecto</Alert>
          ) :
            <>
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </>
          }

        </>
        )}
    </div>
  );
};

export default TaskData;
