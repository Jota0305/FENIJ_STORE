import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Store, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  LogOut, 
  Menu, 
  X,
  Home,
  User,
  DollarSign
} from 'lucide-react';

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Cambié a false por defecto para móviles
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Cerrar sidebar al hacer clic en un link (para móviles)
  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  // Enlaces del menú
// Enlaces del menú
const menuItems = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/products', icon: Package, label: 'Productos' },
  { path: '/sales', icon: ShoppingCart, label: 'Ventas' },
  { path: '/cashier', icon: DollarSign, label: 'Caja' },
  { path: '/reports', icon: BarChart3, label: 'Reportes' }
];
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar superior */}
      <nav className="bg-white shadow-lg fixed w-full z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo y botón de menú */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-600 hover:text-gray-800 focus:outline-none"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Store className="text-blue-600" size={28} />
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-gray-800">FENIJ STORE</h1>
                  <p className="text-xs text-gray-500 hidden sm:block">Sistema de Ventas</p>
                </div>
              </div>
            </div>

            {/* Usuario y logout */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                <User className="text-gray-600" size={20} />
                <span className="text-gray-700 font-medium">{user?.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 sm:space-x-2 bg-red-500 text-white px-2 sm:px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay para cerrar sidebar en móvil */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-full bg-white shadow-lg transition-transform duration-300 z-20 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 w-64`}
      >
        <nav className="mt-8">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-6 py-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
                }`
              }
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Contenido principal */}
      <main
        className={`transition-all duration-300 pt-20 p-4 sm:p-6 lg:p-8 lg:ml-64`}
      >
        {children}
      </main>
    </div>
  );
}

export default Layout;