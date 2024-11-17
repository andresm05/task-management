"use client"

import AdminLayout from "@/layouts/_layout";
import {Button} from "@/components/ui/button";
import {Undo2} from "lucide-react";
import {useRouter} from "next/router";
import IsLoading from "@/molecules/isLoading";
import useMiddleware from "@/hooks/useMiddleware";
import {Role} from "@/utils/enums";
import { ProjectCreationForm } from "@/molecules/projectCreationForm";


const CreateItemPage: React.FC = () => {

    const user = useMiddleware(Role.USER);

    const router = useRouter();

    const handleBack = (event: any) => {
        event.preventDefault();
        router.back();
    };

    if (!user) {
        return <IsLoading/>;
    }

    return (
        <AdminLayout user={user}>
            <div className={"w-4/5 mx-auto"}>
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center mb-4">
                    Agregar un item al menu</h1>
                <Button variant="secondary" className="mt-4 mb-2" onClick={handleBack}>
                    <Undo2 /> Regresar
                </Button>
                <ProjectCreationForm />
            </div>
        </AdminLayout>
    );
};

export default CreateItemPage;
