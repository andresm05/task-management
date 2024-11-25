import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useMutation } from "@apollo/client";
import { UPDATE_PROJECT } from "@/utils/graphql/mutations/project";
import { Project } from "@/types/projects";

interface EditProjectPopupProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  project: Project;
  onTaskUpdated: () => void;
}

const EditProjectPopup: React.FC<EditProjectPopupProps> = ({
  open,
  setOpen,
  project,
  onTaskUpdated,
}) => {
  const [formData, setFormData] = useState({
    name: project.name || "",
    description: project.description || "",
  });

  const [updateProject, { loading }] = useMutation(UPDATE_PROJECT, {
    onCompleted: () => {
      onTaskUpdated();
      setOpen(false);
    },
    onError: (error) => {
      console.error("Error updating project:", error.message);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateProject({
      variables: {
        id: project.id,
        name: formData.name,
        description: formData.description,
      },
    });
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Editar Proyecto</DialogTitle>
      <DialogContent>
        <TextField
          label="Nombre"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Descripción"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="primary">
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          color="primary"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProjectPopup;
