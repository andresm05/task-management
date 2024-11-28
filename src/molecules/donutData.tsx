import { GET_PROJECTS } from "@/utils/graphql/queries/projects";

import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { Pie, PieChart, Cell, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Project } from "@/types/projects";
import { Task } from "@/types/tasks";

const TaskStatus = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

export const DonutData = () => {
  const { data: projectsData, loading: projectsLoading } = useQuery(GET_PROJECTS);

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>("all");

  const projectTasks = useMemo(() => {
    if (!projectsData) return [];

    if (selectedProjectId === "all") {
      // Combinar tareas de todos los proyectos
      return projectsData.projects.flatMap((project: Project) => project.tasks);
    } else {
      // Filtrar tareas del proyecto seleccionado
      const selectedProject = projectsData.projects.find(
        (project: any) => project.id === selectedProjectId
      );
      return selectedProject ? selectedProject.tasks : [];
    }
  }, [selectedProjectId, projectsData]);

  const taskCounts = useMemo(() => {
    const counts = {
      PENDING: 0,
      IN_PROGRESS: 0,
      COMPLETED: 0,
    };
    projectTasks.forEach((task: Task) => {
      counts[task.status as keyof typeof TaskStatus]++;
    });
    return counts;
  }, [projectTasks]);

  const generateRandomColor = () => {
    // Genera un color aleatorio en formato HSL
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 40) + 60; // 60% - 100%
    const lightness = Math.floor(Math.random() * 30) + 50; // 50% - 80%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

  const chartData = [
    { name: "Pending", value: taskCounts.PENDING, color: generateRandomColor() },
    { name: "In Progress", value: taskCounts.IN_PROGRESS, color: generateRandomColor() },
    { name: "Completed", value: taskCounts.COMPLETED, color: generateRandomColor() },
  ];

  return (
    <Card className="flex flex-col m-4">
      <CardHeader className="flex items-center pb-0">
        <CardTitle>Estado de las tareas por proyecto</CardTitle>
        <CardDescription>Selecciona un proyecto para ver el detalle de las tareas o analiza el detalle general</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 items-center">
        {/* Dropdown para seleccionar proyecto */}
        {projectsLoading ? (
          <p>Cargando proyectos...</p>
        ) : (
          <Select onValueChange={setSelectedProjectId} defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los proyectos</SelectItem>
              {projectsData?.projects.map((project: Project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Gráfico de Tareas */}
        {projectTasks.length > 0 ? (
          <>
            <PieChart width={400} height={400}>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}

                label={({ name, value }) => `${name}: ${value}`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>

          </>
        ) : (
          <p>Aún no hay tareas asignadas a este proyecto</p>
        )}
      </CardContent>
    </Card>
  );
}
