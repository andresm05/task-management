import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import { DELETE_TASK } from "@/utils/graphql/mutations/tasks";
import { useMutation } from "@apollo/client";

interface DeleteTaskPopupProps {
  open: boolean; // Controla si el popup está abierto o cerrado
  taskId: string; // ID de la tarea a eliminar
  taskTitle: string; // Título de la tarea a mostrar en el popup
  onClose: () => void; // Función para cerrar el popup
  onTaskDeleted: () => void; // Callback para actualizar la lista de tareas
}

const DeleteTaskPopup: React.FC<DeleteTaskPopupProps> = ({ open, taskId, taskTitle, onClose, onTaskDeleted }) => {
  const [deleteTask, { loading }] = useMutation(DELETE_TASK, {
    variables: { id: taskId },
    onCompleted: () => {
      onTaskDeleted(); // Llama al callback para actualizar la lista
      onClose(); // Cierra el popup
    },
    onError: (error) => {
      console.error("Error eliminando tarea:", error.message);
    },
  });
  

  const handleDelete = () => {
    deleteTask();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Eliminar Tarea</DialogTitle>
      <DialogContent>
        <Typography>
          ¿Estás seguro de que deseas eliminar la tarea <strong>{taskTitle}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading} color="secondary">
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
