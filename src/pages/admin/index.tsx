import AdminLayout from "@/layouts/_layout";
import useMiddleware from "@/hooks/useMiddleware";
import { useQuery } from '@apollo/client';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import IsLoading from "@/molecules/isLoading";
import {Role} from "@/utils/enums";
import { ProjectsCard } from "@/molecules/ProjectsCard";

export default function AdminPage() {
    const user = useMiddleware(Role.USER);

    const router = useRouter();

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
                <ProjectsCard />
            </div>
        </AdminLayout>
    );
};