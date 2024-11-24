import useMiddleware from "@/hooks/useMiddleware";
import { GetProjects, Project } from "@/types/projects";
import { Role } from "@/types/users";
import { GET_PROJECTS } from "@/utils/graphql/queries/projects";
import { useQuery } from "@apollo/client";
import { ProjectCard } from "./ProjectCard";
import { useEffect, useState } from "react";

export const ProjectData = () => {
  const { data } = useQuery<GetProjects>(GET_PROJECTS);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const projects = data?.projects || [];

  const user = useMiddleware(Role.USER);

  useEffect(() => {
    if (user?.role === Role.USER) {
      const userProjects = projects.filter((project) =>
        project.tasks.some((task) => task.assignee?.id === user.id)
      );
      console.log(projects);
      console.log(userProjects);
      setFilteredProjects(userProjects);
    }
    console.log(projects);

  }, [data]);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {user?.role === Role.USER && (
        <>
          {filteredProjects.map((project) => (
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
