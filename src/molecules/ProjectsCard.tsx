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
          className="bg-slate-200"
        >
          <CardHeader>
            <h2 className="text-lg font-bold text-gray-800">{project.name}</h2>
          </CardHeader>
          <div className="p-4">
            <p className="text-gray-600">{project.description || "Sin descripción"}</p>
          </div>
          <CardFooter className="justify-end">
            <Link
              href={{ pathname: "/admin/tasks/[id]", query: { id: project.id } }}
            >
              Ver Tareas
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
