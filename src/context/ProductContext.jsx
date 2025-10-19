import { createContext, useState, useContext } from 'react';

const ProductContext = createContext();

export function ProductProvider({ children }) {

  const [products, setProducts] = useState([
    
    {
      id: 1,
      sku: 'NIK-AM-001',
      brand: 'Nike',
      model: 'Air Max 90',
      color: 'Blanco/Negro',
      price: 450.00,
      sizes: [
        { size: '38', stock: 5 },
        { size: '39', stock: 3 },
        { size: '40', stock: 8 },
        { size: '41', stock: 2 },
        { size: '42', stock: 0 }
      ]
    }
  ]);

  // Agregar producto
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now() // ID único basado en timestamp
    };
    setProducts([...products, newProduct]);
  };

  // Actualizar producto
  const updateProduct = (id, updatedProduct) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, ...updatedProduct } : product
    ));
  };

  // Eliminar un producto
  const deleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  // Función para actualizar stock de una talla específica
  const updateStock = (productId, size, newStock) => {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          sizes: product.sizes.map(s => 
            s.size === size ? { ...s, stock: newStock } : s
          )
        };
      }
      return product;
    }));
  };

  // Función para obtener un producto por ID
  const getProductById = (id) => {
    return products.find(product => product.id === id);
  };

  const value = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    getProductById
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts debe usarse dentro de ProductProvider');
  }
  return context;
}