import React from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Pencil, Trash2, UserPlus, Users } from 'lucide-react';
import { Person } from './types/Person';
import { api } from './services/api';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { PersonForm } from './components/PersonForm';

function App() {
  const { signOut } = useAuthenticator();
  const [persons, setPersons] = React.useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = React.useState<Person | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  const fetchPersons = async () => {
    try {
      const response = await api.getPersons();
      setPersons(response.data);
    } catch (error) {
      toast.error('Error al cargar las personas');
    }
  };

  React.useEffect(() => {
    fetchPersons();
  }, []);

  const handleCreate = async (person: Omit<Person, 'id'>) => {
    try {
      await api.createPerson(person);
      toast.success('Persona creada exitosamente');
      setIsFormOpen(false);
      fetchPersons();
    } catch (error) {
      toast.error('Error al crear la persona');
    }
  };

  const handleUpdate = async (person: Omit<Person, 'id'>) => {
    if (!selectedPerson?.id) return;
    try {
      await api.updatePerson(selectedPerson.id, person);
      toast.success('Persona actualizada exitosamente');
      setIsFormOpen(false);
      setSelectedPerson(null);
      fetchPersons();
    } catch (error) {
      toast.error('Error al actualizar la persona');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar esta persona?')) return;
    try {
      await api.deletePerson(id);
      toast.success('Persona eliminada exitosamente');
      fetchPersons();
    } catch (error) {
      toast.error('Error al eliminar la persona');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-indigo-600" />
              <h1 className="text-2xl font-semibold text-gray-900">Gestión de Personas</h1>
            </div>
            <button
              onClick={() => {
                setSelectedPerson(null);
                setIsFormOpen(true);
              }}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Nueva Persona
            </button>
            <button onClick={signOut}>Sign out</button>
          </div>

          {isFormOpen ? (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">
                {selectedPerson ? 'Editar Persona' : 'Nueva Persona'}
              </h2>
              <PersonForm
                person={selectedPerson || undefined}
                onSubmit={selectedPerson ? handleUpdate : handleCreate}
                onCancel={() => {
                  setIsFormOpen(false);
                  setSelectedPerson(null);
                }}
              />
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DNI</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Género</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">F. Nacimiento</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {persons.map((person) => (
                      <tr key={person.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{person.dni}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {person.firstName} {person.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {person.gender === 'M' ? 'Masculino' : person.gender === 'F' ? 'Femenino' : 'Otro'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {format(new Date(person.birthDate), 'dd/MM/yyyy', { locale: es })}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{person.address}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedPerson(person);
                              setIsFormOpen(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => person.id && handleDelete(person.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;