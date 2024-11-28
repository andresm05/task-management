import { GET_PROJECTS } from "@/utils/graphql/queries/projects";

import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Pie, PieChart, Cell, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TaskStatus = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

export default function ProjectTaskStats() {
  const { data: projectsData, loading: projectsLoading } = useQuery(GET_PROJECTS);

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>("all");

  const projectTasks = React.useMemo(() => {
    if (!projectsData) return [];

    if (selectedProjectId === "all") {
      // Combinar tareas de todos los proyectos
      return projectsData.projects.flatMap((project: any) => project.tasks);
    } else {
      // Filtrar tareas del proyecto seleccionado
      const selectedProject = projectsData.projects.find(
        (project: any) => project.id === selectedProjectId
      );
      return selectedProject ? selectedProject.tasks : [];
    }
  }, [selectedProjectId, projectsData]);

  const taskCounts = React.useMemo(() => {
    const counts = {
      PENDING: 0,
      IN_PROGRESS: 0,
      COMPLETED: 0,
    };
    projectTasks.forEach((task: any) => {
      counts[task.status as keyof typeof TaskStatus]++;
    });
    return counts;
  }, [projectTasks]);

  const chartData = [
    { name: "Pending", value: taskCounts.PENDING, color: "#854d0e" },
    { name: "In Progress", value: taskCounts.IN_PROGRESS, color: "#1e40af" },
    { name: "Completed", value: taskCounts.COMPLETED, color: "#166534" },
  ];

  return (
    <Card className="flex flex-col m-4">
      <CardHeader className="flex items-center pb-0">
        <CardTitle>Project Task Stats</CardTitle>
        <CardDescription>Select a project to view its task breakdown or view all projects.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 items-center">
        {/* Dropdown para seleccionar proyecto */}
        {projectsLoading ? (
          <p>Loading projects...</p>
        ) : (
          <Select onValueChange={setSelectedProjectId} defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projectsData?.projects.map((project: any) => (
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
            <div className="flex justify-center gap-4 text-sm font-semibold">
              <div className="bg-yellow-100 text-yellow-800  py-1 px-2 rounded-lg inline-block">
                <strong >Pending:</strong> {taskCounts.PENDING}
              </div>
              <div className="bg-blue-100 text-blue-800 py-1 px-2 rounded-lg inline-block">
                <strong >In Progress:</strong> {taskCounts.IN_PROGRESS}
              </div>
              <div className="bg-green-100 text-green-800 py-1 px-2 rounded-lg inline-block">
                <strong >Completed:</strong> {taskCounts.COMPLETED}
              </div>
            </div>
          </>
        ) : (
          <p>No tasks available for the selected project.</p>
        )}
      </CardContent>
    </Card>
  );
}
