import { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { Package, Plus, Edit, Trash2, Search } from 'lucide-react';
import ProductForm from '../components/ProductForm';

function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Filtrar productos según búsqueda
  const filteredProducts = products.filter(product =>
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para calcular stock total de un producto
  const getTotalStock = (sizes) => {
    return sizes.reduce((total, size) => total + size.stock, 0);
  };

  // Abrir formulario para nuevo producto
  const handleNewProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  // Abrir formulario para editar producto
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  // Guardar producto (nuevo o editado)
  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  // Confirmar eliminación
  const handleDeleteProduct = (product) => {
    if (window.confirm(`¿Estás seguro de eliminar ${product.brand} ${product.model}?`)) {
      deleteProduct(product.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Gestión de Productos</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Administra el inventario de zapatillas</p>
        </div>
        <button 
          onClick={handleNewProduct}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          <span>Nuevo Producto</span>
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por marca, modelo o SKU..."
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
                SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Marca
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Modelo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Color
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  <Package className="mx-auto mb-2 text-gray-400" size={48} />
                  <p>No se encontraron productos</p>
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.brand}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.model}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.color}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    S/ {product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      getTotalStock(product.sizes) > 10 
                        ? 'bg-green-100 text-green-800' 
                        : getTotalStock(product.sizes) > 0 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {getTotalStock(product.sizes)} unidades
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditProduct(product)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product)}
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
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            <Package className="mx-auto mb-2 text-gray-400" size={48} />
            <p>No se encontraron productos</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow p-4">
              {/* Header de la card */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800">
                    {product.brand} {product.model}
                  </h3>
                  <p className="text-sm text-gray-600">{product.color}</p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEditProduct(product)}
                    className="text-blue-600 hover:text-blue-800 p-2"
                  >
                    <Edit size={20} />
                  </button>
                  <button 
                    onClick={() => handleDeleteProduct(product)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              {/* Detalles */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">SKU:</span>
                  <span className="font-medium text-gray-900">{product.sku}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Precio:</span>
                  <span className="font-bold text-gray-900">S/ {product.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-gray-600">Stock Total:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    getTotalStock(product.sizes) > 10 
                      ? 'bg-green-100 text-green-800' 
                      : getTotalStock(product.sizes) > 0 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {getTotalStock(product.sizes)} unidades
                  </span>
                </div>
              </div>

              {/* Stock por tallas (colapsable u opcional) */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-600 mb-2">Stock por talla:</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.filter(s => s.stock > 0).map((size) => (
                    <span 
                      key={size.size} 
                      className="text-xs bg-gray-100 px-2 py-1 rounded"
                    >
                      {size.size}: {size.stock}
                    </span>
                  ))}
                  {product.sizes.every(s => s.stock === 0) && (
                    <span className="text-xs text-red-600">Sin stock disponible</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de formulario */}
      <ProductForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleSaveProduct}
        product={editingProduct}
      />
    </div>
  );
}

export default Products;