import { useState, useEffect } from 'react'
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'

export function useFechas(soloActivos = true) {
  const [fechas, setFechas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let q
    if (soloActivos) {
      q = query(
        collection(db, 'fechas'),
        where('activo', '==', true),
        orderBy('fecha', 'asc')
      )
    } else {
      q = query(
        collection(db, 'fechas'),
        orderBy('fecha', 'asc')
      )
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
        setFechas(data)
        setLoading(false)
      },
      (err) => {
        console.error('Error cargando fechas:', err)
        setError(err.message)
        setLoading(false)
      }
    )

    return unsubscribe
  }, [soloActivos])

  async function agregarFecha(datos) {
    return addDoc(collection(db, 'fechas'), {
      ...datos,
      creadoEn: serverTimestamp(),
    })
  }

  async function actualizarFecha(id, datos) {
    const ref = doc(db, 'fechas', id)
    return updateDoc(ref, datos)
  }

  async function eliminarFecha(id) {
    const ref = doc(db, 'fechas', id)
    return deleteDoc(ref)
  }

  return {
    fechas,
    loading,
    error,
    agregarFecha,
    actualizarFecha,
    eliminarFecha,
  }
}
