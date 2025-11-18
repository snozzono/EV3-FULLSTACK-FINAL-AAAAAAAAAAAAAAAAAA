import { useParams, Link } from 'react-router-dom'
import { blogs } from '../data/blogs'

export default function BlogDetalle() {
  const { id } = useParams()
  const blog = blogs.find((b) => String(b.id) === String(id))

  if (!blog) {
    return (
      <div>
        <h2>Blog no encontrado</h2>
        <Link to="/blogs" className="btn btn-secondary mt-2">Volver a blogs</Link>
      </div>
    )
  }

  return (
    <div className="row">
      <div className="col-md-8">
        <h2 className="mb-3">{blog.titulo}</h2>
        <img src={blog.imagen} alt={blog.titulo} className="img-fluid mb-3" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Blog' }} />
        <p>{blog.contenido}</p>
        <Link to="/blogs" className="btn btn-outline-secondary">Volver</Link>
      </div>
    </div>
  )
}