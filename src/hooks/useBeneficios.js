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
  getDoc,
} from 'firebase/firestore'
import { db } from '../firebase'

export function useBeneficios(soloActivos = true) {
  const [beneficios, setBeneficios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let q
    if (soloActivos) {
      q = query(
        collection(db, 'beneficios'),
        where('activo', '==', true),
        orderBy('orden', 'asc')
      )
    } else {
      q = query(
        collection(db, 'beneficios'),
        orderBy('orden', 'asc')
      )
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
        setBeneficios(data)
        setLoading(false)
      },
      (err) => {
        console.error('Error cargando beneficios:', err)
        setError(err.message)
        setLoading(false)
      }
    )

    return unsubscribe
  }, [soloActivos])

  async function getBeneficio(id) {
    const ref = doc(db, 'beneficios', id)
    const snap = await getDoc(ref)
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() }
    }
    return null
  }

  async function agregarBeneficio(datos) {
    return addDoc(collection(db, 'beneficios'), {
      ...datos,
      creadoEn: serverTimestamp(),
      actualizadoEn: serverTimestamp(),
    })
  }

  async function actualizarBeneficio(id, datos) {
    const ref = doc(db, 'beneficios', id)
    return updateDoc(ref, {
      ...datos,
      actualizadoEn: serverTimestamp(),
    })
  }

  async function eliminarBeneficio(id) {
    const ref = doc(db, 'beneficios', id)
    return deleteDoc(ref)
  }

  return {
    beneficios,
    loading,
    error,
    getBeneficio,
    agregarBeneficio,
    actualizarBeneficio,
    eliminarBeneficio,
  }
}
