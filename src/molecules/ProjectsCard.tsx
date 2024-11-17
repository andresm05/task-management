import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { GET_PROJECTS } from "@/utils/graphql/queries/projects";
import { useQuery } from "@apollo/client";

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
            <Button
              variant="outline"
              className="text-blue-600 hover:bg-blue-100 border-blue-600 transition-colors duration-200"
            >
              Ver más
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
