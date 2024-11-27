import React, { useState } from "react";
import { Alert, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar } from "@mui/material";
import { Button } from "@mui/material";
import { useMutation } from "@apollo/client";
import { DELETE_PROJECT } from "@/utils/graphql/mutations/project";
import { Project } from "@/types/projects";
import { GET_PROJECTS } from "@/utils/graphql/queries/projects";

interface DeleteProjectPopupProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  project: Project;

}

const DeleteProjectPopup: React.FC<DeleteProjectPopupProps> = ({
  open,
  setOpen,
  project,
}) => {
  const [deleteProject, { loading }] = useMutation(DELETE_PROJECT, {
    variables: { id: project.id },
    refetchQueries: [{
      query: GET_PROJECTS
    }],
    awaitRefetchQueries: true,
  });

  const [openInfo, setOpenInfo] = useState(false);
  const [openError, setOpenError] = useState(false);

  const handleDelete = async () => {
    const { data, errors } = await deleteProject({
      variables: {
        id: project.id,
      },
    });

    setOpen(false);

    if (data) {
      setOpenInfo(true);
    }
    if (errors) {
      setOpenInfo(true);
      setOpenError(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenInfo(false);
    setOpenError(false);
  }

  return (
    <>
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
      <Snackbar
  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
  open={openInfo}
  autoHideDuration={3000}
  onClose={() => setOpenInfo(false)}
>
  {openError ? (
    <Alert onClose={handleCloseSnackbar} severity="error" variant="filled">
      Error al eliminar el proyecto
    </Alert>
  ) : (
    <Alert onClose={handleCloseSnackbar} severity="success" variant="filled">
      Proyecto eliminado
    </Alert>
  )}
</Snackbar>

    </>
  );
};

export default DeleteProjectPopup;
