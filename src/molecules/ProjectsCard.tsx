import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { GET_PROJECTS } from "@/utils/graphql/queries/projects";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/router";

export const ProjectsCard = () => {
  const { data } = useQuery(GET_PROJECTS);
  const projects = data?.projects || [];


  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project: any) => (
        <Card
  key={project.id}
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

      ))}
    </div>
  );
};
