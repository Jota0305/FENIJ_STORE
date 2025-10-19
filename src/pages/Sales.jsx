import { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { useSales } from '../context/SalesContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Plus, Minus, Trash2, Search, Ticket } from 'lucide-react';

function Sales() {
  const { products } = useProducts();
  const { createTicket } = useSales();
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedTicket, setGeneratedTicket] = useState(null);

  // Filtrar productos con stock disponible
  const availableProducts = products.filter(product => {
    const hasStock = product.sizes.some(size => size.stock > 0);
    const matchesSearch = 
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    return hasStock && matchesSearch;
  });

  // Seleccionar producto para agregar al carrito
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setSelectedSize('');
  };

  // Agregar al carrito
  const handleAddToCart = () => {
    if (!selectedProduct || !selectedSize) return;

    const sizeData = selectedProduct.sizes.find(s => s.size === selectedSize);
    if (!sizeData || sizeData.stock <= 0) {
      alert('No hay stock disponible para esta talla');
      return;
    }

    // Verificar si ya existe en el carrito
    const existingItemIndex = cart.findIndex(
      item => item.productId === selectedProduct.id && item.size === selectedSize
    );

    if (existingItemIndex >= 0) {
      // Incrementar cantidad si ya existe
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      updatedCart[existingItemIndex].subtotal = 
        updatedCart[existingItemIndex].quantity * updatedCart[existingItemIndex].price;
      setCart(updatedCart);
    } else {
      // Agregar nuevo item
      const newItem = {
        productId: selectedProduct.id,
        sku: selectedProduct.sku,
        brand: selectedProduct.brand,
        model: selectedProduct.model,
        color: selectedProduct.color,
        size: selectedSize,
        quantity: 1,
        price: selectedProduct.price,
        subtotal: selectedProduct.price
      };
      setCart([...cart, newItem]);
    }

    // Limpiar selección
    setSelectedProduct(null);
    setSelectedSize('');
  };

  // Cambiar cantidad de un item
  const handleChangeQuantity = (index, change) => {
    const updatedCart = [...cart];
    const newQuantity = updatedCart[index].quantity + change;

    if (newQuantity <= 0) {
      updatedCart.splice(index, 1);
    } else {
      updatedCart[index].quantity = newQuantity;
      updatedCart[index].subtotal = newQuantity * updatedCart[index].price;
    }

    setCart(updatedCart);
  };

  // Eliminar item del carrito
  const handleRemoveItem = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
  };

  // Calcular total
  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.subtotal, 0);
  };

  // Generar ticket
  const handleGenerateTicket = () => {
    if (cart.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    const ticket = createTicket(cart, user.username);
    setGeneratedTicket(ticket);
    setShowSuccessModal(true);
    setCart([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Punto de Venta</h1>
        <p className="text-gray-600 mt-1">Genera tickets de pedido</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de productos */}
        <div className="lg:col-span-2 space-y-4">
          {/* Búsqueda */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Lista de productos */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Productos Disponibles</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {availableProducts.map((product) => (
                <div
                  key={product.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                    selectedProduct?.id === product.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => handleSelectProduct(product)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {product.brand} {product.model}
                      </h3>
                      <p className="text-sm text-gray-600">{product.color}</p>
                      <p className="text-xs text-gray-500 mt-1">SKU: {product.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">S/ {product.price.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">
                        {product.sizes.filter(s => s.stock > 0).length} tallas
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selector de talla */}
          {selectedProduct && (
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-800 mb-3">
                Selecciona una talla para: {selectedProduct.brand} {selectedProduct.model}
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {selectedProduct.sizes
                  .filter(s => s.stock > 0)
                  .map((size) => (
                    <button
                      key={size.size}
                      onClick={() => setSelectedSize(size.size)}
                      className={`py-2 px-3 rounded-lg border-2 transition-colors ${
                        selectedSize === size.size
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      <div className="text-sm font-semibold">{size.size}</div>
                      <div className="text-xs text-gray-500">{size.stock} disp.</div>
                    </button>
                  ))}
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                <Plus size={20} />
                <span>Agregar al Carrito</span>
              </button>
            </div>
          )}
        </div>

        {/* Panel del carrito */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-4 sticky top-20">
            <div className="flex items-center space-x-2 mb-4">
              <ShoppingCart className="text-blue-600" size={24} />
              <h2 className="text-lg font-semibold text-gray-800">Carrito</h2>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="mx-auto mb-2 text-gray-300" size={48} />
                <p>Carrito vacío</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                  {cart.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm text-gray-800">
                            {item.brand} {item.model}
                          </h4>
                          <p className="text-xs text-gray-600">
                            Talla: {item.size} | {item.color}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleChangeQuantity(index, -1)}
                            className="bg-gray-200 rounded p-1 hover:bg-gray-300"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => handleChangeQuantity(index, 1)}
                            className="bg-gray-200 rounded p-1 hover:bg-gray-300"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-gray-900">
                          S/ {item.subtotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-gray-800">Total:</span>
                    <span className="text-2xl font-bold text-gray-900">
                      S/ {getTotal().toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={handleGenerateTicket}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 font-semibold"
                  >
                    <Ticket size={20} />
                    <span>Generar Ticket</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal de éxito */}
      {showSuccessModal && generatedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <Ticket className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¡Ticket Generado!
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  {generatedTicket.ticketNumber}
                </p>
                <p className="text-sm text-gray-600">
                  Total: <span className="font-bold">S/ {generatedTicket.total.toFixed(2)}</span>
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  El cliente debe ir a caja para realizar el pago
                </p>
              </div>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setGeneratedTicket(null);
                }}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
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

export default Sales;