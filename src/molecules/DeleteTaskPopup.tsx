import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import { DELETE_TASK } from "@/utils/graphql/mutations/tasks";
import { useMutation } from "@apollo/client";
import { Task } from "@/types/tasks";
import router, { useRouter } from 'next/router';
import { GET_TASKS_BY_PROJECT } from "@/utils/graphql/queries/tasks";

interface DeleteTaskPopupProps {
  open: boolean;
  task: Task;
  setOpen: (open: boolean) => void;
}

const DeleteTaskPopup: React.FC<DeleteTaskPopupProps> = ({ open, task, setOpen }) => {

  const router = useRouter();
  const { id } = router.query;
  const [deleteTask, { loading, data, error }] = useMutation(DELETE_TASK, {
    variables: { id: task.id },
    refetchQueries: [{
      query: GET_TASKS_BY_PROJECT,
      variables: { projectId: id },
    }],
    awaitRefetchQueries: true,
  });


  const handleDelete = async () => {
    await deleteTask();

    setOpen(false);


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
