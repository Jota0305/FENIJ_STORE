import { createContext, useState, useContext } from 'react';

const SalesContext = createContext();

export function SalesProvider({ children }) {
  // Estado para almacenar todos los tickets/pedidos
  const [tickets, setTickets] = useState([
    // Ticket de ejemplo
    {
      id: 1,
      ticketNumber: 'TKT-001',
      date: new Date().toISOString(),
      items: [
        {
          productId: 1,
          sku: 'NIK-AM-001',
          brand: 'Nike',
          model: 'Air Max 90',
          color: 'Blanco/Negro',
          size: '40',
          quantity: 1,
          price: 450.00,
          subtotal: 450.00
        }
      ],
      total: 450.00,
      status: 'PENDIENTE', // PENDIENTE, PAGADO, CANCELADO
      createdBy: 'vendedor1',
      paymentInfo: null
    }
  ]);

  // Contador para generar números de ticket únicos
  const [ticketCounter, setTicketCounter] = useState(2);

  // Función para crear un nuevo ticket
  const createTicket = (items, createdBy) => {
    const ticketNumber = `TKT-${String(ticketCounter).padStart(3, '0')}`;
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);

    const newTicket = {
      id: Date.now(),
      ticketNumber,
      date: new Date().toISOString(),
      items,
      total,
      status: 'PENDIENTE',
      createdBy,
      paymentInfo: null
    };

    setTickets([...tickets, newTicket]);
    setTicketCounter(ticketCounter + 1);
    return newTicket;
  };

  // Función para marcar un ticket como pagado
  const markAsPaid = (ticketId, paymentInfo) => {
    setTickets(tickets.map(ticket =>
      ticket.id === ticketId
        ? { ...ticket, status: 'PAGADO', paymentInfo }
        : ticket
    ));
  };

  // Función para cancelar un ticket
  const cancelTicket = (ticketId) => {
    setTickets(tickets.map(ticket =>
      ticket.id === ticketId
        ? { ...ticket, status: 'CANCELADO' }
        : ticket
    ));
  };

  // Función para obtener tickets pendientes
  const getPendingTickets = () => {
    return tickets.filter(ticket => ticket.status === 'PENDIENTE');
  };

  // Función para obtener tickets pagados
  const getPaidTickets = () => {
    return tickets.filter(ticket => ticket.status === 'PAGADO');
  };

  // Función para obtener un ticket por ID
  const getTicketById = (id) => {
    return tickets.find(ticket => ticket.id === id);
  };

  const value = {
    tickets,
    createTicket,
    markAsPaid,
    cancelTicket,
    getPendingTickets,
    getPaidTickets,
    getTicketById
  };

  return (
    <SalesContext.Provider value={value}>
      {children}
    </SalesContext.Provider>
  );
}

// Hook personalizado
export function useSales() {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error('useSales debe usarse dentro de SalesProvider');
  }
  return context;
}