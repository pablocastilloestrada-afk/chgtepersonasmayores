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

export function useAvisos(soloActivos = true) {
  const [avisos, setAvisos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let q
    if (soloActivos) {
      q = query(
        collection(db, 'avisos'),
        where('activo', '==', true),
        orderBy('creadoEn', 'desc')
      )
    } else {
      q = query(
        collection(db, 'avisos'),
        orderBy('creadoEn', 'desc')
      )
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
        setAvisos(data)
        setLoading(false)
      },
      (err) => {
        console.error('Error cargando avisos:', err)
        setError(err.message)
        setLoading(false)
      }
    )

    return unsubscribe
  }, [soloActivos])

  async function agregarAviso(datos) {
    return addDoc(collection(db, 'avisos'), {
      ...datos,
      creadoEn: serverTimestamp(),
    })
  }

  async function actualizarAviso(id, datos) {
    const ref = doc(db, 'avisos', id)
    return updateDoc(ref, datos)
  }

  async function eliminarAviso(id) {
    const ref = doc(db, 'avisos', id)
    return deleteDoc(ref)
  }

  return {
    avisos,
    loading,
    error,
    agregarAviso,
    actualizarAviso,
    eliminarAviso,
  }
}
