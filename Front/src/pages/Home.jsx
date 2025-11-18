import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const [productos, setProductos] = useState([])
  useEffect(() => {
    const load = async () => {
      try {
        const resp = await fetch('http://localhost:8080/api/products')
        if (!resp.ok) return
        const data = await resp.json()
        setProductos(data)
      } catch {
        setProductos([])
      }
    }
    load()
  }, [])
  return (
    <>
      <div className="px-4 py-5 my-4">
        <div className="row align-items-center g-4">
          <div className="col-12 col-md-6">
            <div className="text-md-start text-center">
              <i className="bi bi-book-fill d-block mb-3" style={{ fontSize: '5rem', color: 'var(--brand-primary)' }}></i>
              <h1 className="display-6 fw-bold">Bienvenido a MangaStore</h1>
              <p className="lead mb-3">Explora nuestro catálogo de manga y encuentra tus favoritos.</p>
              <div className="d-flex justify-content-center justify-content-md-start gap-2">
                <Link to="/productos" className="btn btn-warning btn-lg px-4">Ver catálogo</Link>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 d-none d-md-block">
            <div className="ratio ratio-16x9">
              <iframe
                src="https://www.youtube-nocookie.com/embed/videoseries?list=PLkqN7b9u5k90CqlLMI0eyIKAyKG7uM0Uy&rel=0&modestbranding=1"
                title="Playlist Anime MangaStore"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                loading="lazy"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
        <div className="d-block d-md-none mt-3">
          <div className="ratio ratio-4x3">
            <iframe
              src="https://www.youtube-nocookie.com/embed/videoseries?list=PLkqN7b9u5k90CqlLMI0eyIKAyKG7uM0Uy&rel=0&modestbranding=1"
              title="Playlist Anime MangaStore"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              loading="lazy"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
      <h2 className="mb-3" id="catalogo">Productos</h2>
      <div className="row g-3">
        {productos.map(p => (
          <div key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </>
  )
}