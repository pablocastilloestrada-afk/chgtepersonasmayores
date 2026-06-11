# Municipalidad de Chiguayante - Personas Mayores

Aplicación web para la Municipalidad de Chiguayante que ayuda a las personas mayores a encontrar beneficios sociales, fechas importantes y avisos municipales.

## Características

- **Vista pública**: Beneficios sociales, fechas importantes y avisos municipales
- **Panel de administración**: Gestión completa de contenidos con autenticación Firebase
- **Diseño accesible**: Fuentes grandes, alto contraste, botones grandes
- **Responsive**: Optimizado para móviles con navegación inferior

## Tecnologías

- React 18 + Vite
- Firebase (Firestore + Authentication)
- React Router v6
- Tailwind CSS

## Configuración

1. Copia `.env.example` a `.env.local`
2. Configura las variables de Firebase en `.env.local`
3. En Firebase Console, habilita Authentication (Email/Password) y Firestore
4. Crea un usuario administrador en Firebase Authentication

## Instalación

```bash
npm install
npm run dev
```

## Estructura de colecciones Firestore

### beneficios
- titulo, descripcion, categoria, requisitos[], comoPostular, contacto, activo, orden, creadoEn, actualizadoEn

### fechas
- titulo, descripcion, fecha (Timestamp), tipo, lugar, activo, creadoEn

### avisos
- titulo, contenido, urgencia, activo, creadoEn, expiraEn (opcional)

## Panel de Administración

Accede en `/admin/login` con credenciales de Firebase Authentication.
El dashboard incluye un botón "Cargar datos de ejemplo" para poblar la base de datos.
