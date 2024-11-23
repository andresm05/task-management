import useMiddleware from "@/hooks/useMiddleware";
import { GetProjects } from "@/types/projects";
import { Role } from "@/types/users";
import { GET_PROJECTS } from "@/utils/graphql/queries/projects";
import { useQuery } from "@apollo/client";
import { ProjectCard } from "./ProjectCard";

export const ProjectData = () => {
  const { data } = useQuery<GetProjects>(GET_PROJECTS);
  const projects = data?.projects || [];

  const user = useMiddleware(Role.USER);
  const userProjects = projects.filter((project) =>
    project.tasks.some((task) => task.assignee?.id === user?.id)
  );

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {user?.role === Role.USER && (
        <>
          {userProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />

          ))}
        </>
      )}
      {user?.role === Role.ADMIN && (
        <>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </>
      )}

    </div>
  );
};
