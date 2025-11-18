import seedProductos from './productos'

const PRODUCTS_KEY = 'repo_products'
const PRODUCTS_VERSION_KEY = 'repo_products_version'
const PRODUCTS_VERSION = 'manga-v1'

function read(key) {
  const raw = localStorage.getItem(key)
  return raw ? JSON.parse(raw) : null
}
function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getProducts() {
  let data = read(PRODUCTS_KEY)
  const version = read(PRODUCTS_VERSION_KEY)
  if (!data || version !== PRODUCTS_VERSION) {
    data = seedProductos
    write(PRODUCTS_KEY, data)
    write(PRODUCTS_VERSION_KEY, PRODUCTS_VERSION)
  }
  return data
}

export function createProduct(product) {
  const list = getProducts()
  const id = product.id ?? String(Date.now())
  const nuevo = { ...product, id }
  write(PRODUCTS_KEY, [nuevo, ...list])
  return nuevo
}

export function updateProduct(id, changes) {
  const list = getProducts()
  const idx = list.findIndex((p) => String(p.id) === String(id))
  if (idx === -1) return false
  const updated = { ...list[idx], ...changes }
  const next = [...list]
  next[idx] = updated
  write(PRODUCTS_KEY, next)
  return true
}

export function deleteProduct(id) {
  const list = getProducts()
  const next = list.filter((p) => String(p.id) !== String(id))
  write(PRODUCTS_KEY, next)
  return true
}

export function getCategories() {
  const list = getProducts()
  const set = new Set(list.map((p) => p.categoria))
  return Array.from(set)
}