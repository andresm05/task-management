import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_TASK } from '@/utils/graphql/mutations/tasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TaskStatus } from '@/types/tasks';
import { GET_ALL_USERS_QUERY } from '@/utils/graphql/queries/users';
import { AllUsers } from '@/types/users';

const CreateTaskPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query; // Obtener el id del proyecto de los parámetros de la URL

  const [createTask, { loading, error }] = useMutation(CREATE_TASK);
  const { data } = useQuery<AllUsers>(GET_ALL_USERS_QUERY);
  const users = data?.users || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    const title = data.title as string;
    const description = data.description as string;
    const assignee = data.assignee as string;
    const dueDate = new Date(data.dueDate as string);

    try {
      const { data } = await createTask({
        variables: {
          assigneeId: assignee,
          title,
          description,
          status: TaskStatus.PENDING,
          dueDate,
          projectId: id, // Usamos el ID del proyecto pasado como parámetro
        },
      });

      // Manejo después de la creación exitosa de la tarea
      console.log('Tarea creada:', data.createTask);

      // Redirigir a la página de gestión del proyecto después de crear la tarea
      router.push({
        pathname: `/admin/tasks/${id}`,
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
            name='title'
            placeholder="Ingresa el título"
            required
          />
        </div>

        <div>
          <select name="assignee" id="assignee" required
            className="w-full p-2 border border-gray-300 rounded-md">
            <option value="">Seleccionar Responsable</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            placeholder="Añadir una descripción"
            name='description'
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">Fecha de vencimiento</Label>
          <Input
            id="dueDate"
            type="datetime-local"
            name='dueDate'
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
