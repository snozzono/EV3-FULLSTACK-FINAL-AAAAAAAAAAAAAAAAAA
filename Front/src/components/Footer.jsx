import React, { useState } from "react";

export default function Footer() {
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("newsletter1");
    const email = emailInput.value.trim();

    setMessage({ text: "", type: "" });
    setIsLoading(true);

    // Validación simple basada en HTML5 y un patrón básico
    const isValid = /.+@.+\..+/.test(email);

    if (!isValid) {
      setMessage({
        text: "Por favor, ingresa un correo válido (ejemplo: nombre@correo.com)",
        type: "error",
      });
      setIsLoading(false);
      return;
    }

    try {
      const resp = await fetch('http://localhost:8080/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      if (!resp.ok) {
        setMessage({ text: 'No se pudo suscribir. Inténtalo más tarde.', type: 'error' })
        setIsLoading(false)
        return
      }
      setMessage({ text: '¡Gracias por suscribirte! Pronto recibirás nuestras novedades.', type: 'success' })
      emailInput.value = ''
    } catch {
      setMessage({ text: 'Error de red. Intenta nuevamente.', type: 'error' })
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <footer className="brand-footer mt-5 py-4">
      <div className="container border-top">
        <div className="row py-4">
          {/* Sección Contacto */}
          <div className="col-12 col-lg-3 mb-4">
            <h5 className="fw-bold text-dark mb-3">Contacto</h5>
            <div className="d-flex flex-column gap-2">
              <p className="mb-0 d-flex align-items-center">
                <i className="bi bi-envelope me-2 text-secondary"></i>
                <span className="text-dark">info@mangastore.cl</span>
              </p>
              <p className="mb-0 d-flex align-items-center">
                <i className="bi bi-telephone-fill me-2 text-secondary"></i>
                <span className="text-dark">+56 9 1234 5678</span>
              </p>
              <p className="mb-0 d-flex align-items-center">
                <i className="bi bi-geo-alt-fill me-2 text-secondary"></i>
                <span className="text-dark">Santiago, Chile</span>
              </p>
              <p className="mb-0 d-flex align-items-center">
                <i className="bi bi-calendar me-2 text-secondary"></i>
                <span className="text-dark">Lun - Vie: 9:00 - 18:00</span>
              </p>
            </div>
          </div>

          {/* Sección Redes Sociales */}
          <div className="col-12 col-lg-3 mb-4">
            <h5 className="fw-bold text-dark mb-3">Síguenos</h5>
            <div className="d-flex flex-column gap-2">
              <div className="d-flex align-items-center text-decoration-none text-dark">
                <i className="bi bi-facebook me-2 text-secondary"></i>
                <span>Manga Store</span>
              </div>
              <div className="d-flex align-items-center text-decoration-none text-dark">
                <i className="bi bi-instagram me-2 text-secondary"></i>
                <span>Manga_Store</span>
              </div>
              <div className="d-flex align-items-center text-decoration-none text-dark">
                <i className="bi bi-twitter-x me-2 text-secondary"></i>
                <span>@MangaStore</span>
              </div>
              <div className="d-flex align-items-center text-decoration-none text-dark">
                <i className="bi bi-youtube me-2 text-secondary"></i>
                <span>@MangaStoreYT</span>
              </div>
            </div>
          </div>

          {/* Newsletter (visual similar) */}
          <div className="col-md-5 offset-md-1 mb-3">
            <form id="newsletterForm" onSubmit={handleNewsletterSubmit}>
              <h5>Suscríbete al blog</h5>
              <p>
                Cada vez que haya un post te lo tiramos directo al mail.
              </p>
              <div className="d-flex flex-column flex-sm-row w-100 gap-2">
                <label htmlFor="newsletter1" className="visually-hidden">
                  correo
                </label>
                <input
                  id="newsletter1"
                  type="email"
                  className="form-control"
                  placeholder="correo"
                  required
                  disabled={isLoading}
                />
                <button className="btn btn-warning" type="submit" disabled={isLoading}>
                  {isLoading ? "Procesando..." : "Suscribirse"}
                </button>
              </div>
            </form>

            {/* Mensajes */}
            <div id="messageArea" className="mt-3">
              {message.text && (
                <div
                  className={`alert ${
                    message.type === "success"
                      ? "alert-success"
                      : message.type === "warning"
                      ? "alert-warning"
                      : "alert-danger"
                  } alert-dismissible fade show`}
                  role="alert"
                >
                  {message.text}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setMessage({ text: "", type: "" })}
                    aria-label="Close"
                  ></button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="d-flex flex-column flex-sm-row justify-content-between py-3 my-2 border-top">
          <p className="mb-0 text-muted">
            © {new Date().getFullYear()} MangaStore. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}