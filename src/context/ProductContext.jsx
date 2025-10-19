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
  },
  {
    id: 2,
    sku: 'ADI-UL-002',
    brand: 'Adidas',
    model: 'Ultraboost 22',
    color: 'Negro/Gris',
    price: 520.00,
    sizes: [
      { size: '38', stock: 4 },
      { size: '39', stock: 6 },
      { size: '40', stock: 7 },
      { size: '41', stock: 3 },
      { size: '42', stock: 1 }
    ]
  },
  {
    id: 3,
    sku: 'PUM-RS-003',
    brand: 'Puma',
    model: 'RS-X Efekt',
    color: 'Azul/Blanco',
    price: 410.00,
    sizes: [
      { size: '38', stock: 2 },
      { size: '39', stock: 5 },
      { size: '40', stock: 4 },
      { size: '41', stock: 6 },
      { size: '42', stock: 3 }
    ]
  },
  {
    id: 4,
    sku: 'NB-990-004',
    brand: 'New Balance',
    model: '990v6',
    color: 'Gris',
    price: 590.00,
    sizes: [
      { size: '38', stock: 7 },
      { size: '39', stock: 5 },
      { size: '40', stock: 3 },
      { size: '41', stock: 4 },
      { size: '42', stock: 2 }
    ]
  },
  {
    id: 5,
    sku: 'CON-CH-005',
    brand: 'Converse',
    model: 'Chuck Taylor All Star',
    color: 'Blanco',
    price: 320.00,
    sizes: [
      { size: '38', stock: 8 },
      { size: '39', stock: 10 },
      { size: '40', stock: 6 },
      { size: '41', stock: 3 },
      { size: '42', stock: 1 }
    ]
  },
  {
    id: 6,
    sku: 'REE-CL-006',
    brand: 'Reebok',
    model: 'Classic Leather',
    color: 'Blanco',
    price: 380.00,
    sizes: [
      { size: '38', stock: 6 },
      { size: '39', stock: 5 },
      { size: '40', stock: 7 },
      { size: '41', stock: 4 },
      { size: '42', stock: 2 }
    ]
  },
  {
    id: 7,
    sku: 'VAN-OL-007',
    brand: 'Vans',
    model: 'Old Skool',
    color: 'Negro/Blanco',
    price: 340.00,
    sizes: [
      { size: '38', stock: 9 },
      { size: '39', stock: 7 },
      { size: '40', stock: 6 },
      { size: '41', stock: 5 },
      { size: '42', stock: 2 }
    ]
  },
  {
    id: 8,
    sku: 'JOR-RE-008',
    brand: 'Jordan',
    model: 'Retro 4',
    color: 'Rojo/Negro',
    price: 680.00,
    sizes: [
      { size: '38', stock: 2 },
      { size: '39', stock: 4 },
      { size: '40', stock: 5 },
      { size: '41', stock: 3 },
      { size: '42', stock: 0 }
    ]
  },
  {
    id: 9,
    sku: 'AS-GL-009',
    brand: 'Asics',
    model: 'Gel-Lyte III',
    color: 'Verde/Beige',
    price: 440.00,
    sizes: [
      { size: '38', stock: 3 },
      { size: '39', stock: 4 },
      { size: '40', stock: 6 },
      { size: '41', stock: 3 },
      { size: '42', stock: 1 }
    ]
  },
  {
    id: 10,
    sku: 'BAL-TR-010',
    brand: 'Balenciaga',
    model: 'Triple S',
    color: 'Gris/Amarillo',
    price: 1200.00,
    sizes: [
      { size: '38', stock: 1 },
      { size: '39', stock: 1 },
      { size: '40', stock: 2 },
      { size: '41', stock: 0 },
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