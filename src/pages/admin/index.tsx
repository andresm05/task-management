import AdminLayout from "@/layouts/_layout";
import useMiddleware from "@/hooks/useMiddleware";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import IsLoading from "@/molecules/isLoading";
import { Role } from "@/utils/enums";
import { ProjectData } from "@/molecules/projectData";
import { useEffect, useState } from "react";

export default function AdminPage() {
    const user = useMiddleware(Role.USER);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (user?.role === Role.ADMIN) {
            setIsAdmin(true);
        }
    }
        , [user]);


    if (!user) {
        return <IsLoading />;
    }

    return (
        <AdminLayout user={user}>
            <div className='w-4/5 mx-auto'>
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center mb-4">
                    Gestion de Proyectos
                </h1>
                <Button className={`${isAdmin ? 'm-4' : 'hidden'}`} asChild>
                    <Link href={"/admin/createProject"}>
                        <Plus />Agregar un Proyecto
                    </Link>
                </Button>
                <ProjectData />
            </div>
        </AdminLayout>
    );
};