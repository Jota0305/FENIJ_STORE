import { useState } from 'react';
import { useCustomers } from '../context/CustomerContext';
import { Users, Plus, Edit, Trash2, Search, Mail, Phone, ShoppingBag } from 'lucide-react';
import CustomerForm from '../components/CustomerForm';

function Customers() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useCustomers();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // Filtrar clientes según búsqueda
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  // Abrir formulario para nuevo cliente
  const handleNewCustomer = () => {
    setEditingCustomer(null);
    setIsFormOpen(true);
  };

  // Abrir formulario para editar cliente
  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setIsFormOpen(true);
  };

  // Guardar cliente (nuevo o editado)
  const handleSaveCustomer = (customerData) => {
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, customerData);
    } else {
      addCustomer(customerData);
    }
    setIsFormOpen(false);
    setEditingCustomer(null);
  };

  // Confirmar eliminación
  const handleDeleteCustomer = (customer) => {
    if (window.confirm(`¿Estás seguro de eliminar a ${customer.name}?`)) {
      deleteCustomer(customer.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Gestión de Clientes</h1>
          <p className="text-gray-600 mt-1">Administra la información de tus clientes</p>
        </div>
        <button 
          onClick={handleNewCustomer}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <h3 className="text-sm font-semibold text-gray-600">Total Clientes</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{customers.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <h3 className="text-sm font-semibold text-gray-600">Clientes Activos</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {customers.filter(c => c.totalPurchases > 0).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <h3 className="text-sm font-semibold text-gray-600">Nuevos Este Mes</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {customers.filter(c => {
              const customerDate = new Date(c.createdAt);
              const now = new Date();
              return customerDate.getMonth() === now.getMonth() && 
                     customerDate.getFullYear() === now.getFullYear();
            }).length}
          </p>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre, email o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Vista de tabla (desktop) */}
      <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Teléfono
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Compras
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Gastado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  <Users className="mx-auto mb-2 text-gray-400" size={48} />
                  <p>No se encontraron clientes</p>
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {customer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Mail size={16} className="text-gray-400 mr-2" />
                      {customer.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Phone size={16} className="text-gray-400 mr-2" />
                      {customer.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <ShoppingBag size={16} className="text-gray-400 mr-2" />
                      {customer.totalPurchases}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    S/ {customer.totalSpent.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditCustomer(customer)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteCustomer(customer)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Vista de cards (móvil y tablet) */}
      <div className="lg:hidden space-y-4">
        {filteredCustomers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            <Users className="mx-auto mb-2 text-gray-400" size={48} />
            <p>No se encontraron clientes</p>
          </div>
        ) : (
          filteredCustomers.map((customer) => (
            <div key={customer.id} className="bg-white rounded-lg shadow p-4">
              {/* Header de la card */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center flex-1">
                  <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">
                      {customer.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-bold text-gray-800">{customer.name}</h3>
                    <p className="text-sm text-gray-600">{customer.totalPurchases} compras</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEditCustomer(customer)}
                    className="text-blue-600 hover:text-blue-800 p-2"
                  >
                    <Edit size={20} />
                  </button>
                  <button 
                    onClick={() => handleDeleteCustomer(customer)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              {/* Detalles */}
              <div className="space-y-2 border-t pt-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail size={16} className="mr-2" />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone size={16} className="mr-2" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-2 border-t">
                  <span className="text-gray-600">Total Gastado:</span>
                  <span className="font-bold text-gray-900">S/ {customer.totalSpent.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de formulario */}
      <CustomerForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCustomer(null);
        }}
        onSubmit={handleSaveCustomer}
        customer={editingCustomer}
      />
    </div>
  );
}

export default Customers;