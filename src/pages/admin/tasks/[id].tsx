import { useRouter } from "next/router";
import React from "react";
import TaskCard from "@/molecules/TaskCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import AdminLayout from "@/layouts/_layout";
import useMiddleware from "@/hooks/useMiddleware";
import { Role } from "@/utils/enums";
import IsLoading from "@/molecules/isLoading";

const TasksProject = () => {
  const router = useRouter();
  const { id } = router.query; // Extrae el parámetro `id` de la URL

  const user = useMiddleware(Role.USER);

  if (!user) {
    return <IsLoading />;
  }

  if (!id) {
    return <p>Cargando...</p>;
  }

  return (
    <AdminLayout user={user}>
      <div className="w-4/5 mx-auto">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center mb-4">
          Gestión de Proyectos
        </h1>
        <Button className="m-4" asChild>
          <Link href={{ pathname: "/admin/tasks/create/[id]", query: { id: id } }}>
            <Plus /> Agregar una tarea
          </Link>
        </Button>
        <TaskCard id={id as string} />
      </div>
    </AdminLayout>
  );
};

export default TasksProject;
