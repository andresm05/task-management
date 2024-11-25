import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { Task } from "@/types/tasks";
import { useEffect, useState } from "react";
import { FaPenSquare, FaTrashAlt } from "react-icons/fa";
import DeleteTaskPopup from "./DeleteTaskPopup";
import EditTaskPopup from "./editTaskPopup";
import { handleShowStatus } from "@/utils/helpers";
import useMiddleware from "@/hooks/useMiddleware";
import { Role } from "@/types/users";

interface TaskCardProps {
    task: Task;
    refetch: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
    task,
    refetch
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


    const handleDateFormated = (timestamp: string): string => {
        const date = new Date(Number(timestamp)); // Convertir el timestamp a un objeto Date

        // Formatear la fecha como "día mes año, hora:minutos"
        return new Intl.DateTimeFormat('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false, // Formato 24 horas
        }).format(date);
    };
    return (
        <div>

            <Card
                key={task.id}
                className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-300"
            >
                <CardHeader className="bg-gray-100 p-4">
                    <h2 className="text-xl font-semibold text-gray-800">{task.title}</h2>
                </CardHeader>

                <div className="p-6 space-y-4">
                    <p className="text-gray-700 text-sm">
                        {task.description || "Sin descripción"}
                    </p>

                    {/* Estado con estilos dinámicos */}
                    <p
                        className={`text-sm font-semibold py-1 px-2 rounded-lg inline-block ${task.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : task.status === "IN_PROGRESS"
                                ? "bg-blue-100 text-blue-800"
                                : task.status === "COMPLETED"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                    >
                        Estado: {handleShowStatus(task.status)}
                    </p>

                    {/* Fecha límite resaltada */}
                    <p
                        className={`text-sm font-medium ${new Date(parseInt(task.dueDate, 10)) < new Date() && task.status !== "COMPLETED"
                            ? "text-red-500"
                            : "text-gray-600"
                            }`}
                    >
                        <strong>Fecha límite:</strong> {handleDateFormated(task.dueDate)}
                    </p>

                    {task.assignee && (
                        <p className="text-sm text-gray-600">
                            <strong>Asignado a:</strong> {task.assignee.name}
                        </p>
                    )}
                </div>

                <CardFooter className="bg-gray-50 p-4 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                    <div className="text-xs text-gray-500">
                        <p>Creado: {handleDateFormated(task.createdAt)}</p>
                        <p>Actualizado: {handleDateFormated(task.updatedAt)}</p>
                    </div>

                    <div className="flex space-x-4">
                        {/* Botón para abrir el popup de eliminación */}
                        <Button
                            className={` ${!isAdmin ? 'hidden' : 'flex items-center justify-center p-3 rounded-md border border-red-500 bg-red-50 hover:bg-red-100 '}`}
                            onClick={() => setOpenDelete(true)}
                        >
                            <FaTrashAlt className="text-red-500 w-5 h-5" />
                        </Button>

                        {/* Botón para abrir el popup de edición */}
                        <Button
                            className={' flex items-center justify-center p-3 rounded-md border border-blue-500 bg-blue-50 hover:bg-blue-100 '}
                            onClick={() => setOpenEdit(true)}
                        >
                            <FaPenSquare className="text-blue-500 w-5 h-5" />
                        </Button>
                    </div>
                </CardFooter>
            </Card>

            <DeleteTaskPopup open={openDelete} setOpen={setOpenDelete} task={task} onTaskDeleted={refetch} />
            <EditTaskPopup open={openEdit} setOpen={setOpenEdit} task={task} onTaskUpdated={refetch} />
        </div>
    )
}
