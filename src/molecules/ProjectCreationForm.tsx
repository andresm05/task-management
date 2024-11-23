// src/pages/CreateProjectPage.tsx
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_PROJECT } from "@/utils/graphql/mutations/project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import router from "next/router";

const CreateProjectPage: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [createProject, { loading, error, data }] = useMutation(CREATE_PROJECT);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await createProject({
        variables: { name, description },
      });
      console.log("Proyecto creado exitosamente:", data.createProject); // Asegúrate de este log
      alert("Proyecto creado exitosamente");
      setName(""); // Reinicia los campos del formulario
      setDescription("");
    } catch (err) {
      console.error("Error al crear proyecto:", err);
    }

    router.push({
      pathname: `/admin`,
    });
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Crear Nuevo Proyecto</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del Proyecto</Label>
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
      {error && <p className="text-red-500 mt-2">{error.message}</p>}
    </div>
  );
};

export default CreateProjectPage;
