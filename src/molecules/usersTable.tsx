import { Button } from "@/components/ui/button";
import { FaPenSquare, FaTrashAlt } from "react-icons/fa";
import { useMutation } from "@apollo/client";
import { DELETE_USER_MUTATION } from "@/utils/graphql/mutations/users";
import { useRouter } from "next/router";
import { UserProps } from "@/utils/enums";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Icons } from "@/components/ui/icons";
import * as React from "react";

interface UsersTableProps {
    users: UserProps[];
    refetch: () => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({ users, refetch }) => {
    const [deleteUser] = useMutation(DELETE_USER_MUTATION);
    const [deletingId, setDeletingId] = React.useState<string | null>(null);
    const router = useRouter();

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        await deleteUser({ variables: { id } });
        refetch();
        setDeletingId(null);
    };

    const handleEdit = (id: string) => {
        router.push(`/admin/editUser?id=${id}`);
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell className="space-x-3">
                            <Button
                                variant="secondary"
                                onClick={() => handleEdit(user.id)}
                                className="text-blue-600 hover:text-blue-800"
                            >
                                <FaPenSquare className="w-4 h-4" />
                            </Button>
                            <Button
                                onClick={() => handleDelete(user.id)}
                                disabled={deletingId === user.id}
                                variant="destructive"
                                className="text-red-600 hover:text-red-800"
                            >
                                {deletingId === user.id ? (
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <FaTrashAlt className="w-4 h-4" />
                                )}
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
