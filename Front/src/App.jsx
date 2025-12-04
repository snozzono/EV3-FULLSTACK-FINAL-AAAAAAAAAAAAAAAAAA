import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import ProductoDetalle from './pages/ProductoDetalle'
import Carrito from './pages/Carrito'
import Contacto from './pages/Contacto'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Perfil from './pages/Perfil'
import Blogs from './pages/Blogs'
import BlogDetalle from './pages/BlogDetalle'
import Nosotros from './pages/Nosotros'
import Productos from './pages/Productos'
// import Ofertas from './pages/Ofertas'
import Comprar from './pages/Comprar'
import PerfilBoleta from './pages/PerfilBoleta'
import AdminLayout from './admin/AdminLayout'
import AdminHome from './admin/AdminHome'
import AdminProductos from './admin/AdminProductos'
import AdminProductoForm from './admin/AdminProductoForm'
import AdminUsuarios from './admin/AdminUsuarios'
import AdminUsuarioForm from './admin/AdminUsuarioForm'
import AdminBlogs from './admin/AdminBlogs'
import AdminBlogForm from './admin/AdminBlogForm'
import AdminContacto from './admin/AdminContacto'
import AdminCompras from './admin/AdminCompras'
import AdminCompraDetalle from './admin/AdminCompraDetalle'
import ProtectedRoute, { ROLES } from './router/ProtectedRoute'
import ClientLayout from './client/ClientLayout'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Navbar />
        <main className="container my-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/producto/:id" element={<ProductoDetalle />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/carrito/checkout" element={<Comprar />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blog/:id" element={<BlogDetalle />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/productos" element={<Productos />} />
            {/* Página de ofertas removida */}
            {/* Admin */}
            <Route
              path="/cliente/*"
              element={
                <ProtectedRoute allowRoles={[ROLES.CLIENTE]}>
                  <ClientLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Perfil />} />
              <Route path="perfil" element={<Perfil />} />
              <Route path="perfil/:id" element={<PerfilBoleta />} />
            </Route>
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowRoles={[ROLES.ADMIN]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminHome />} />
              <Route path="productos" element={<AdminProductos />} />
              <Route path="productos/nuevo" element={<AdminProductoForm />} />
              <Route path="productos/editar/:id" element={<AdminProductoForm />} />
              <Route path="usuarios" element={<AdminUsuarios />} />
              <Route path="usuarios/nuevo" element={<AdminUsuarioForm />} />
              <Route path="usuarios/editar/:id" element={<AdminUsuarioForm />} />
              <Route path="blogs" element={<AdminBlogs />} />
              <Route path="blogs/nuevo" element={<AdminBlogForm />} />
              <Route path="blogs/editar/:id" element={<AdminBlogForm />} />
              <Route path="contacto" element={<AdminContacto />} />
              <Route path="compras" element={<AdminCompras />} />
              <Route path="compras/:id" element={<AdminCompraDetalle />} />
              <Route path="perfil" element={<Perfil />} />
            </Route>
            {/* Rutas administrativas protegidas */}
          </Routes>
        </main>
        <Footer />
      </CartProvider>
    </AuthProvider>
  )
}
