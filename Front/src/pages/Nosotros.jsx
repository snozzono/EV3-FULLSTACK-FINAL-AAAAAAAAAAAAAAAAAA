export default function Nosotros() {
  return (
    <div className="container px-4 py-5" id="nosotros">
      <h2 className="pb-2 border-bottom">Sobre Nosotros</h2>
      <p className="lead text-muted">Conoce más sobre nuestra pasión por el manga y nuestro compromiso contigo.</p>
      <div className="row row-cols-1 row-cols-md-3 g-4 py-5">
        <div className="col">
          <div className="card h-100">
            <div className="card-body d-flex">
              <i className="bi bi-collection fs-2 me-3"></i>
              <div>
                <h3 className="fw-bold">Calidad Garantizada</h3>
                <p>Todos nuestros mangas son originales y están en perfectas condiciones.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card h-100">
            <div className="card-body d-flex">
              <i className="bi bi-truck fs-2 me-3"></i>
              <div>
                <h3 className="fw-bold">Alcance Nacional</h3>
                <p>Envíos rápidos y seguros a todo Chile con tracking completo.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card h-100">
            <div className="card-body d-flex">
              <i className="bi bi-people fs-2 me-3"></i>
              <div>
                <h3 className="fw-bold">Comunidad</h3>
                <p>Más que una tienda, somos una comunidad de amantes del manga.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card h-100">
            <div className="card-body d-flex">
              <i className="bi bi-star fs-2 me-3"></i>
              <div>
                <h3 className="fw-bold">Nuestra Pasión</h3>
                <p>Somos fanáticos del manga desde hace más de 10 años. Seleccionamos cuidadosamente cada título para que descubras las mejores historias.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card h-100">
            <div className="card-body d-flex">
              <i className="bi bi-gift fs-2 me-3"></i>
              <div>
                <h3 className="fw-bold">Envío Rápido</h3>
                <p>Ofrecemos envíos rápidos y seguros, porque sabemos la emoción de recibir tus mangas favoritos.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card h-100">
            <div className="card-body d-flex">
              <i className="bi bi-headset fs-2 me-3"></i>
              <div>
                <h3 className="fw-bold">Soporte 24/7</h3>
                <p>Nuestro equipo está disponible para ayudarte con productos, pedidos y recomendaciones.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}