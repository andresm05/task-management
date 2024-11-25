import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Button } from "@mui/material";
import { useMutation } from "@apollo/client";
import { DELETE_PROJECT } from "@/utils/graphql/mutations/project";
import { Project } from "@/types/projects";

interface DeleteProjectPopupProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  project: Project;
  onTaskDeleted: () => void;
  
}

const DeleteProjectPopup: React.FC<DeleteProjectPopupProps> = ({
  open,
  setOpen,
  project,
  onTaskDeleted,
}) => {
  const [deleteProject, { loading }] = useMutation(DELETE_PROJECT, {
    variables: { id: project.id },
    onCompleted: () => {
      onTaskDeleted();
      setOpen(false);
    },
    onError: (error) => {
      console.error("Error deleting project:", error.message);
    },
  });

  const handleDelete = () => {
    deleteProject();
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Eliminar Proyecto</DialogTitle>
      <DialogContent>
        ¿Estás seguro de que quieres eliminar el proyecto **{project.name}**?
        Esta acción no se puede deshacer.
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="primary">
          Cancelar
        </Button>
        <Button
          onClick={handleDelete}
          color="secondary"
          disabled={loading}
        >
          {loading ? "Eliminando..." : "Eliminar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteProjectPopup;
