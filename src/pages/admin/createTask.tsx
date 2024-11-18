import { useRouter } from 'next/router';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_TASK } from '@/utils/graphql/mutations/tasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; 
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const CreateTaskPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query; // Obtener el id del proyecto de los parámetros de la URL

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('PENDING');
  const [dueDate, setDueDate] = useState('');

  const [createTask, { loading, error }] = useMutation(CREATE_TASK);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await createTask({
        variables: {
          title,
          description,
          status,
          dueDate,
          projectId: id, // Usamos el ID del proyecto pasado como parámetro
        },
      });

      // Manejo después de la creación exitosa de la tarea
      console.log('Tarea creada:', data.createTask);

      // Redirigir a la página de gestión del proyecto después de crear la tarea
      router.push({
        pathname: `/admin/${id}`,
        query: { id },
      });

    } catch (err) {
      console.error('Error al crear tarea:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Crear Tarea</h1>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Título de la tarea</Label>
          <Input
            id="title"
            type="text"
            placeholder="Ingresa el título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            placeholder="Añadir una descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="status">Estado</Label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="PENDING">Por hacer</option>
            <option value="IN_PROGRESS">En progreso</option>
            <option value="COMPLETED">Hecho</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">Fecha de vencimiento</Label>
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="mt-6">
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creando tarea...' : 'Crear tarea'}
          </Button>
        </div>
      </form>

      {error && <p className="text-red-500 text-center mt-4">{error.message}</p>}
    </div>
  );
};

export default CreateTaskPage;
