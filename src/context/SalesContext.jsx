import { createContext, useState, useContext } from 'react';

const SalesContext = createContext();

export function SalesProvider({ children }) {
  const [tickets, setTickets] = useState([]);
  const [ticketCounter, setTicketCounter] = useState(1);

  // Función para crear un nuevo ticket (MODIFICADA para incluir cliente)
  const createTicket = (items, createdBy, customerId = null) => {
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
      customerId,  // AGREGADO: ID del cliente
      paymentInfo: null
    };

    setTickets([...tickets, newTicket]);
    setTicketCounter(ticketCounter + 1);
    return newTicket;
  };

  const markAsPaid = (ticketId, paymentInfo) => {
    setTickets(tickets.map(ticket =>
      ticket.id === ticketId
        ? { ...ticket, status: 'PAGADO', paymentInfo }
        : ticket
    ));
  };

  const cancelTicket = (ticketId) => {
    setTickets(tickets.map(ticket =>
      ticket.id === ticketId
        ? { ...ticket, status: 'CANCELADO' }
        : ticket
    ));
  };

  const getPendingTickets = () => {
    return tickets.filter(ticket => ticket.status === 'PENDIENTE');
  };

  const getPaidTickets = () => {
    return tickets.filter(ticket => ticket.status === 'PAGADO');
  };

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

export function useSales() {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error('useSales debe usarse dentro de SalesProvider');
  }
  return context;
}