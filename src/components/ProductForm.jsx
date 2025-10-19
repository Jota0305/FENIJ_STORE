import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

function ProductForm({ isOpen, onClose, onSubmit, product = null }) {
  // Estados para los campos del formulario
  const [formData, setFormData] = useState({
    sku: '',
    brand: '',
    model: '',
    color: '',
    price: '',
    sizes: []
  });

  // Tallas disponibles
  const availableSizes = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];

  // Si estamos editando, cargar los datos del producto
  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      // Si es nuevo producto, inicializar tallas en 0
      setFormData({
        sku: '',
        brand: '',
        model: '',
        color: '',
        price: '',
        sizes: availableSizes.map(size => ({ size, stock: 0 }))
      });
    }
  }, [product]);

  // Manejar cambios en los inputs básicos
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Manejar cambios en el stock de tallas
  const handleSizeStockChange = (size, stock) => {
    const updatedSizes = formData.sizes.map(s =>
      s.size === size ? { ...s, stock: parseInt(stock) || 0 } : s
    );
    setFormData({
      ...formData,
      sizes: updatedSizes
    });
  };

  // Enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar que el precio sea un número
    const productData = {
      ...formData,
      price: parseFloat(formData.price)
    };

    onSubmit(productData);
    onClose();
  };

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header del modal */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Datos básicos del producto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* SKU */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: NIK-AM-001"
                required
              />
            </div>

            {/* Marca */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marca <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Nike, Adidas, Puma"
                required
              />
            </div>

            {/* Modelo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modelo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Air Max 90"
                required
              />
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Blanco/Negro"
                required
              />
            </div>

            {/* Precio */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio (S/) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: 450.00"
                required
              />
            </div>
          </div>

          {/* Gestión de tallas y stock */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Stock por Talla
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {availableSizes.map((size) => {
                const sizeData = formData.sizes.find(s => s.size === size);
                return (
                  <div key={size} className="border border-gray-300 rounded-lg p-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                      Talla {size}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={sizeData?.stock || 0}
                      onChange={(e) => handleSizeStockChange(size, e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {product ? 'Actualizar' : 'Agregar'} Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;