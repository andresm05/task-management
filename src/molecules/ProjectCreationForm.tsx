// src/pages/CreateProjectPage.tsx
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_PROJECT } from "@/utils/graphql/mutations/project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, Snackbar } from "@mui/material";
import { GET_PROJECTS } from "@/utils/graphql/queries/projects";

const CreateProjectPage: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [openInfo, setOpenInfo] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [createProject, { loading, error, data }] = useMutation(CREATE_PROJECT);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, errors } = await createProject({
      variables: {
        name,
        description,
      },
      refetchQueries: [
        {
          query: GET_PROJECTS
        }
      ],
    });

    if (data) {
      setOpenInfo(true);
    }

    if (errors) {
      setOpenInfo(true);
      setOpenError(true);
    }
  };

  return (
    <div className="container mx-auto p-8 flex flex-col w-1/2">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-center">Nombre del Proyecto</Label>
          <Input
            id="name"
            name="name"
            placeholder="Introduce el nombre del proyecto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Introduce una breve descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creando proyecto..." : "Crear proyecto"}
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
          variant="filled">Error al crear el proyecto</Alert> :
          <Alert severity="success"
            variant="filled">Proyecto creado exitosamente</Alert>}
      </Snackbar>
    </div>
  );
};

export default CreateProjectPage;
