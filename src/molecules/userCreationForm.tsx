"use client"

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

import { useMutation } from "@apollo/client";
import { CREATE_USER_MUTATION } from "@/utils/graphql/mutations/users";
import { GET_ALL_USERS_QUERY } from '@/utils/graphql/queries/users';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, Snackbar } from '@mui/material';
import { useState } from "react";
import { Icons } from "@/components/ui/icons";


export const UserCreationForm: React.FC = () => {


    const [createUser, { loading }] = useMutation(CREATE_USER_MUTATION);
    const [openInfo, setOpenInfo] = useState(false);
    const [openError, setOpenError] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const role = formData.get('role') as string;

        const { data, errors } = await createUser({
            variables: {
                name,
                email,
                password,
                role
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
        <div className='flex items-center justify-center w-full'>
            <form onSubmit={handleSubmit} className="space-y-8 mt-6 flex-col items-center w-full justify-center">
                <Input type='text'
                    name='name'
                    id='name'
                    placeholder='Ingrese el nombre'
                    className='w-1/2'
                    required />
                <Input type='email'
                    name='email'
                    id='email'
                    placeholder='Ingrese el email'
                    className='w-1/2'
                    required />
                <Input type='password'
                    name='password'
                    id='password'
                    placeholder='Ingrese la contraseña'
                    className='w-1/2'
                    required />
                <div className='w-1/2'>

                    <Select name='role'
                        required>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona un Rol" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="USER">USER</SelectItem>
                            <SelectItem value="ADMIN">ADMIN</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className='w-1/2'>

                    <Button type='submit' className='w-full' disabled={loading}>
                    {loading ? (
                        <><Icons.spinner className="mr-2 h-4 w-4 animate-spin" />Creando...</>
                    ) : <><Plus />Crear</>}
                    </Button>
                </div>
            </form>

            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                open={openInfo}
                autoHideDuration={3000}
                onClose={() => setOpenInfo(false)}
                key={"bottomright"}
            >
                {openError ? <Alert severity="error"
                    variant="filled">Error al crear el usuario</Alert> :
                    <Alert severity="success"
                        variant="filled">Usuario creado exitosamente</Alert>}
            </Snackbar>
        </div>

    );
};
