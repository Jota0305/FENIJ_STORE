import { useState } from 'react';
import { useSales } from '../context/SalesContext';
import { useProducts } from '../context/ProductContext';
import { DollarSign, CreditCard, Banknote, CheckCircle, XCircle, Eye } from 'lucide-react';

function Cashier() {
  const { tickets, markAsPaid, cancelTicket } = useSales();
  const { updateStock } = useProducts();
  
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('EFECTIVO');
  const [amountReceived, setAmountReceived] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Obtener tickets pendientes
  const pendingTickets = tickets.filter(t => t.status === 'PENDIENTE');

  // Abrir modal de pago
  const handleOpenPayment = (ticket) => {
    setSelectedTicket(ticket);
    setAmountReceived(ticket.total.toString());
    setPaymentMethod('EFECTIVO');
    setShowPaymentModal(true);
  };

  // Procesar pago
  const handleProcessPayment = () => {
    const received = parseFloat(amountReceived);
    
    if (!received || received < selectedTicket.total) {
      alert('El monto recibido debe ser mayor o igual al total');
      return;
    }

    // Descontar stock de los productos
    selectedTicket.items.forEach(item => {
      updateStock(item.productId, item.size, -item.quantity);
    });

    // Marcar como pagado
    const paymentInfo = {
      method: paymentMethod,
      amountReceived: received,
      change: received - selectedTicket.total,
      paidAt: new Date().toISOString(),
      paidBy: 'cajero1' // Aquí podrías usar el usuario actual
    };

    markAsPaid(selectedTicket.id, paymentInfo);
    
    // Cerrar modal
    setShowPaymentModal(false);
    setSelectedTicket(null);
    setAmountReceived('');
  };

  // Ver detalles del ticket
  const handleViewDetails = (ticket) => {
    setSelectedTicket(ticket);
    setShowDetailsModal(true);
  };

  // Cancelar ticket
  const handleCancelTicket = (ticket) => {
    if (window.confirm(`¿Estás seguro de cancelar el ticket ${ticket.ticketNumber}?`)) {
      cancelTicket(ticket.id);
    }
  };

  // Calcular cambio
  const getChange = () => {
    const received = parseFloat(amountReceived) || 0;
    return received - (selectedTicket?.total || 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Caja</h1>
        <p className="text-gray-600 mt-1">Gestiona los pagos de tickets pendientes</p>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <h3 className="text-sm font-semibold text-gray-600">Tickets Pendientes</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{pendingTickets.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <h3 className="text-sm font-semibold text-gray-600">Total por Cobrar</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            S/ {pendingTickets.reduce((sum, t) => sum + t.total, 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <h3 className="text-sm font-semibold text-gray-600">Tickets Pagados Hoy</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {tickets.filter(t => t.status === 'PAGADO').length}
          </p>
        </div>
      </div>

      {/* Lista de tickets pendientes */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Tickets Pendientes de Pago</h2>
        </div>
        
        {pendingTickets.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <CheckCircle className="mx-auto mb-2 text-gray-300" size={48} />
            <p>No hay tickets pendientes de pago</p>
          </div>
        ) : (
          <div className="divide-y">
            {pendingTickets.map((ticket) => (
              <div key={ticket.id} className="p-4 hover:bg-gray-50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  {/* Info del ticket */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-lg font-bold text-gray-900">
                        {ticket.ticketNumber}
                      </span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                        PENDIENTE
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Fecha: {new Date(ticket.date).toLocaleString('es-PE')}</p>
                      <p>Vendedor: {ticket.createdBy}</p>
                      <p>Items: {ticket.items.length} producto(s)</p>
                    </div>
                  </div>

                  {/* Total y acciones */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="text-2xl font-bold text-gray-900">
                        S/ {ticket.total.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex space-x-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleViewDetails(ticket)}
                        className="flex-1 sm:flex-none flex items-center justify-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        <Eye size={18} />
                        <span className="text-sm">Ver</span>
                      </button>
                      <button
                        onClick={() => handleOpenPayment(ticket)}
                        className="flex-1 sm:flex-none flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <DollarSign size={18} />
                        <span className="text-sm">Cobrar</span>
                      </button>
                      <button
                        onClick={() => handleCancelTicket(ticket)}
                        className="flex items-center justify-center px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <XCircle size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de pago */}
      {showPaymentModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">
                Procesar Pago - {selectedTicket.ticketNumber}
              </h3>
            </div>

            <div className="p-6 space-y-6">
              {/* Total a pagar */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Total a Pagar</p>
                <p className="text-3xl font-bold text-gray-900">
                  S/ {selectedTicket.total.toFixed(2)}
                </p>
              </div>

              {/* Método de pago */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de Pago
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPaymentMethod('EFECTIVO')}
                    className={`flex flex-col items-center justify-center py-3 rounded-lg border-2 transition-colors ${
                      paymentMethod === 'EFECTIVO'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    <Banknote size={24} />
                    <span className="text-xs mt-1">Efectivo</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('TARJETA')}
                    className={`flex flex-col items-center justify-center py-3 rounded-lg border-2 transition-colors ${
                      paymentMethod === 'TARJETA'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    <CreditCard size={24} />
                    <span className="text-xs mt-1">Tarjeta</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('TRANSFERENCIA')}
                    className={`flex flex-col items-center justify-center py-3 rounded-lg border-2 transition-colors ${
                      paymentMethod === 'TRANSFERENCIA'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    <DollarSign size={24} />
                    <span className="text-xs mt-1">Transfer.</span>
                  </button>
                </div>
              </div>

              {/* Monto recibido (solo para efectivo) */}
              {paymentMethod === 'EFECTIVO' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monto Recibido
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={amountReceived}
                    onChange={(e) => setAmountReceived(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    placeholder="0.00"
                  />
                  {getChange() >= 0 && (
                    <div className="mt-2 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">Cambio</p>
                      <p className="text-xl font-bold text-green-700">
                        S/ {getChange().toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <div className="p-6 border-t flex space-x-3">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedTicket(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleProcessPayment}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Confirmar Pago
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalles */}
      {showDetailsModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">
                Detalles del Ticket - {selectedTicket.ticketNumber}
              </h3>
            </div>

            <div className="p-6 space-y-4">
              {/* Info general */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Fecha</p>
                    <p className="font-semibold">
                      {new Date(selectedTicket.date).toLocaleString('es-PE')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Vendedor</p>
                    <p className="font-semibold">{selectedTicket.createdBy}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Estado</p>
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                      selectedTicket.status === 'PENDIENTE'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {selectedTicket.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Productos</h4>
                <div className="space-y-2">
                  {selectedTicket.items.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {item.brand} {item.model}
                          </p>
                          <p className="text-sm text-gray-600">
                            Talla: {item.size} | {item.color}
                          </p>
                          <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            S/ {item.price.toFixed(2)} x {item.quantity}
                          </p>
                          <p className="font-bold text-gray-900">
                            S/ {item.subtotal.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">Total:</span>
                  <span className="text-2xl font-bold text-gray-900">
                    S/ {selectedTicket.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedTicket(null);
                }}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cashier;