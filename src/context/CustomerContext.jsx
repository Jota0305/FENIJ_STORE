import { createContext, useState, useContext } from 'react';

const CustomerContext = createContext();

export function CustomerProvider({ children }) {
  // Estado para almacenar todos los clientes
  const [customers, setCustomers] = useState([
    // Cliente de ejemplo
    {
      id: 1,
      name: 'Juan Pérez',
      email: 'juan.perez@example.com',
      phone: '987654321',
      createdAt: new Date().toISOString(),
      totalPurchases: 0,
      totalSpent: 0
    }
  ]);

  // Función para agregar un nuevo cliente
  const addCustomer = (customer) => {
    const newCustomer = {
      ...customer,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      totalPurchases: 0,
      totalSpent: 0
    };
    setCustomers([...customers, newCustomer]);
    return newCustomer;
  };

  // Función para actualizar un cliente
  const updateCustomer = (id, updatedCustomer) => {
    setCustomers(customers.map(customer =>
      customer.id === id ? { ...customer, ...updatedCustomer } : customer
    ));
  };

  // Función para eliminar un cliente
  const deleteCustomer = (id) => {
    setCustomers(customers.filter(customer => customer.id !== id));
  };

  // Función para obtener un cliente por ID
  const getCustomerById = (id) => {
    return customers.find(customer => customer.id === id);
  };

  // Función para actualizar estadísticas de compras del cliente
  const updateCustomerStats = (customerId, purchaseAmount) => {
    setCustomers(customers.map(customer => {
      if (customer.id === customerId) {
        return {
          ...customer,
          totalPurchases: customer.totalPurchases + 1,
          totalSpent: customer.totalSpent + purchaseAmount
        };
      }
      return customer;
    }));
  };

  // Función para buscar clientes por nombre, email o teléfono
  const searchCustomers = (searchTerm) => {
    const term = searchTerm.toLowerCase();
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(term) ||
      customer.email.toLowerCase().includes(term) ||
      customer.phone.includes(term)
    );
  };

  const value = {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerById,
    updateCustomerStats,
    searchCustomers
  };

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
}

// Hook personalizado
export function useCustomers() {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomers debe usarse dentro de CustomerProvider');
  }
  return context;
}