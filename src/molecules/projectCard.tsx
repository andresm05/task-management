import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Project } from "@/types/projects";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaPenSquare, FaTrashAlt } from "react-icons/fa";
import useMiddleware from "@/hooks/useMiddleware";
import { Role } from "@/types/users";
import { useEffect, useState } from "react";
import DeleteProjectPopup from  "@/molecules/deleteProjectPopup";
import EditProjectPopup from "@/molecules/editProjectPopup";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,

}) => {
  const user = useMiddleware(Role.USER);
  const [isAdmin, setIsAdmin] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  // Verificar si el usuario es administrador
  useEffect(() => {
    if (user?.role === Role.ADMIN) {
      setIsAdmin(true);
    }
  }, [user]);

  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;
  const progressPercentage =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  return (
    <div>
      <Card className="bg-white shadow-lg rounded-lg border border-gray-300 overflow-hidden">
        {/* Header con título del proyecto */}
        <CardHeader className="bg-gray-100 p-4">
          <div className="flex flex-row justify-between">
            <h2 className="text-2xl font-semibold text-gray-800 w-4/5">
              {project.name}
            </h2>

            <Link
              href={{
                pathname: "/admin/tasks/[id]",
                query: { id: project.id },
              }}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition duration-200 w-1/5"
            >
              Ver Tareas
            </Link>
          </div>
        </CardHeader>

        {/* Contenido con descripción del proyecto */}
        <div className="p-6">
          <p className="text-gray-700 text-sm leading-relaxed">
            {project.description ||
              "Sin descripción disponible para este proyecto."}
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
        <CardFooter className="bg-gray-50 p-4 flex justify-center">
          <div className="flex space-x-4">
            {/* Botón para abrir el popup de eliminación */}
            <Button
              className={` ${!isAdmin
                  ? "hidden"
                  : "flex items-center justify-center p-3 rounded-md border border-red-500 bg-red-50 hover:bg-red-100 "
                }`}
              onClick={() => setOpenDelete(true)}
            >
              <FaTrashAlt className="text-red-500 w-5 h-5" />
            </Button>

            {/* Botón para abrir el popup de edición */}
            <Button
              className={` ${!isAdmin ? "hidden" : " flex items-center justify-center p-3 rounded-md border border-blue-500 bg-blue-50 hover:bg-blue-100 "
                }`
              }
              onClick={() => setOpenEdit(true)}
            >
              <FaPenSquare className="text-blue-500 w-5 h-5" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      <DeleteProjectPopup
        open={openDelete}
        setOpen={setOpenDelete}
        project={project}
      />
      <EditProjectPopup
        open={openEdit}
        setOpen={setOpenEdit}
        project={project}
      />
    </div>
  );
};
