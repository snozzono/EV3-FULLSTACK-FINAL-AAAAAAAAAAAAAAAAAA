import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const savedNew = localStorage.getItem('carrito_items')
    if (savedNew) return JSON.parse(savedNew)
    const savedOld = localStorage.getItem('cart')
    return savedOld ? JSON.parse(savedOld) : []
  })
  const [checkout, setCheckout] = useState(null)

  useEffect(() => {
    localStorage.setItem('carrito_items', JSON.stringify(items))
  }, [items])

  const add = (product, qty = 1) => {
    setItems(prev => {
      const i = prev.findIndex(p => p.id === product.id)
      if (i >= 0) {
        const copy = [...prev]
        copy[i] = { ...copy[i], qty: copy[i].qty + qty }
        return copy
      }
      return [...prev, { ...product, qty }]
    })
  }

  const remove = id => setItems(prev => prev.filter(p => p.id !== id))
  const updateQty = (id, qty) =>
    setItems(prev => prev.map(p => (p.id === id ? { ...p, qty: Math.max(1, Number(qty)) } : p)))

  const total = useMemo(
    () => items.reduce((sum, p) => sum + (p.precio ?? p.precio_nuevo ?? p.precio_descuento ?? 0) * p.qty, 0),
    [items]
  )

  const clear = () => setItems([])
  const value = { items, add, remove, updateQty, clear, total, checkout, setCheckout }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  return useContext(CartContext)
}