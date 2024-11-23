import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Project } from "@/types/projects";
import Link from "next/link";

interface ProjectCardProps {
    project: Project;
    }

export const ProjectCard: React.FC<ProjectCardProps> = ({
    project
}) => {
  return (
    <Card
    className="bg-white shadow-lg rounded-lg border border-gray-300 overflow-hidden"
  >
    {/* Header con título del proyecto */}
    <CardHeader className="bg-gray-100 p-4">
      <h2 className="text-2xl font-semibold text-gray-800">{project.name}</h2>
    </CardHeader>

    {/* Contenido con descripción del proyecto */}
    <div className="p-6">
      <p className="text-gray-700 text-sm leading-relaxed">
        {project.description || "Sin descripción disponible para este proyecto."}
      </p>
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
