"use client"

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";
import { useMutation } from "@apollo/client";
import { UPDATE_USER_MUTATION } from "@/utils/graphql/mutations/users";
import { UserProps } from "@/utils/enums";
import { Icons } from "@/components/ui/icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, Snackbar } from '@mui/material';
import { useState } from "react";
import { GET_ALL_USERS_QUERY } from "@/utils/graphql/queries/users";


interface UserEditFormProps {
    user: UserProps;
}

export const UserEditForm: React.FC<UserEditFormProps> = ({ user }) => {

    const [updateUser, { loading }] = useMutation(UPDATE_USER_MUTATION);
    const [openInfo, setOpenInfo] = useState<boolean>(false);
    const [openError, setOpenError] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const role = formData.get('role') as string;

        const { data, errors } = await updateUser({
            variables: {
                id: user.id,
                name,
                email,
                password,
                role,
            },
            refetchQueries: [{ query: GET_ALL_USERS_QUERY }]
        });

        if (data) {
            setOpenInfo(true);
            form.reset();
        }

        if (errors) {
            setOpenInfo(true);
            setOpenError(true);
        }


    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="space-y-8 mt-6">
                <Input type='text' placeholder='Nombre' defaultValue={user.name}
                    name='name'
                    required />
                <Input type='email' placeholder='Email' defaultValue={user.email}
                    name='email'
                    required />
                <Input type='password' placeholder='Contraseña' defaultValue=''
                    name='password' />

                <Select name='role'
                    required>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona un Rol" defaultValue={user.role} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="USER">USER</SelectItem>
                        <SelectItem value="ADMIN">ADMIN</SelectItem>
                    </SelectContent>
                </Select>

                <Button
                    type="submit"
                    disabled={loading}
                    className={"mt-4"}
                >
                    {loading ? (
                        <><Icons.spinner className="mr-2 h-4 w-4 animate-spin" />Actualizando ...</>
                    ) : <><Check />Actualizar</>}
                </Button>
            </form>
            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                open={openInfo}
                autoHideDuration={3000}
                onClose={() => setOpenInfo(false)}
                key={"bottomright"}
            >
                {openError ? <Alert severity="error"
                    variant="filled">Hubo un error al crear el usuario</Alert> :
                    <Alert severity="success"
                        variant="filled">Usuario actualizado exitosamente</Alert>}
            </Snackbar>
        </div>
    );
};
