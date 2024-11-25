import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import { DELETE_TASK } from "@/utils/graphql/mutations/tasks";
import { useMutation } from "@apollo/client";
import { Task } from "@/types/tasks";

interface DeleteTaskPopupProps {
  open: boolean;
  task: Task;
  onTaskDeleted: () => void;
  setOpen: (open: boolean) => void;
}

const DeleteTaskPopup: React.FC<DeleteTaskPopupProps> = ({ open, task, onTaskDeleted, setOpen }) => {
  const [deleteTask, { loading }] = useMutation(DELETE_TASK, {
    variables: { id: task.id },
    onCompleted: () => {
      onTaskDeleted(); // Llama al callback para actualizar la lista
      setOpen(false); // Cierra el popup
    },
    onError: (error) => {
      console.error("Error eliminando tarea:", error.message);
    },
  });


  const handleDelete = () => {
    deleteTask();
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth disableEnforceFocus>
      <DialogTitle>Eliminar Tarea</DialogTitle>
      <DialogContent>
        <Typography>
          ¿Estás seguro de que deseas eliminar la tarea <strong>{task.title}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} disabled={loading} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleDelete} disabled={loading} color="error" variant="contained">
          {loading ? "Eliminando..." : "Eliminar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteTaskPopup;
