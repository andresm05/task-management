import AdminLayout from "@/layouts/_layout";
import useMiddleware from "@/hooks/useMiddleware";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import IsLoading from "@/molecules/isLoading";
import {Role} from "@/utils/enums";
import { ProjectData } from "@/molecules/ProjectData";

export default function AdminPage() {
    const user = useMiddleware(Role.USER);


    if (!user) {
        return <IsLoading/>;
    }

    return (
        <AdminLayout user={user}>
            <div className={"w-4/5 mx-auto"}>
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center mb-4">
                    Gestion de Proyectos
                </h1>
                <Button className={"m-4"} asChild>
                    <Link href={"/admin/createProject"}>
                        <Plus />Agregar un Proyecto
                    </Link>
                </Button>
                <ProjectData />
            </div>
        </AdminLayout>
    );
};