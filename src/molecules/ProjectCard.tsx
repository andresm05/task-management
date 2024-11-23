import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Project } from "@/types/projects";
import Link from "next/link";

interface ProjectCardProps {
    project: Project;
    }

export const ProjectCard: React.FC<ProjectCardProps> = ({
    project
}) => {

  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter((task) => task.status === "COMPLETED").length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  return (
    <Card className="bg-white shadow-lg rounded-lg border border-gray-300 overflow-hidden">
    {/* Header con título del proyecto */}
    <CardHeader className="bg-gray-100 p-4">
      <h2 className="text-2xl font-semibold text-gray-800">{project.name}</h2>
    </CardHeader>
  
    {/* Contenido con descripción del proyecto */}
    <div className="p-6">
      <p className="text-gray-700 text-sm leading-relaxed">
        {project.description || "Sin descripción disponible para este proyecto."}
      </p>
  
      {/* Barra de progreso */}
      <div className="mt-4">
        <p className="text-sm text-gray-600 mb-2">
          Progreso: {completedTasks} / {totalTasks} tareas completadas
        </p>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-500 h-4 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  
    {/* Footer con enlace */}
    <CardFooter className="bg-gray-50 p-4 flex justify-end">
      <Link
        href={{ pathname: "/admin/tasks/[id]", query: { id: project.id } }}
        className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition duration-200"
      >
        Ver Tareas
      </Link>
    </CardFooter>
  </Card>
  
  )
}
