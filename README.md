#  Task Manager - Dashboard & Task Management System

Sistema avanzado de gestión de tareas con panel administrativo, roles de usuario y campos dinámicos.  
Construido como una prueba técnica enfocada en arquitectura moderna, seguridad y escalabilidad.

##  Proyecto Publicado
https://task.ragineer.com/login
---
##  ¿Qué incluye?

###  Dashboard de Usuario
- Gestión de tareas (crear, completar, eliminar)
- Estados dinámicos
- Alertas visuales para tareas vencidas (UI en rojo + indicadores de urgencia)

---

###  Panel de Superusuario
- Vista global de usuarios
- Monitoreo de todas las tareas del sistema
- Indicadores de tareas **VENCIDAS**
- Control total de configuración

---

### Campos Dinámicos
- Formularios configurables desde base de datos
- Sin necesidad de modificar código
- Soporte para:
  - Registro de usuarios
  - Creación de tareas

---

###  Autenticación
- Login / Registro con credenciales
- Manejo de sesiones con NextAuth
- Validaciones robustas

---

##  Cómo correr el proyecto

###  Requisitos

- Node.js **v20+**
- npm o yarn

---

##  Instalación local

### 1. Clonar el repositorio

```bash
git clone https://github.com/ragineerd/tasks-manager.git
cd tasks-manager
2. Instalar dependencias
npm install
3. Configurar variables de entorno

Crea un archivo .env en la raíz:

DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="un_secreto_muy_largo_y_aleatorio"
NEXTAUTH_URL="http://localhost:3000"

4. Preparar la base de datos
# Generar cliente Prisma
npx prisma generate

# Sincronizar esquema
npx prisma db push
5. Ejecutar Seed (IMPORTANTE)
NODE_OPTIONS='--loader ts-node/esm' npx prisma db seed

Esto carga los campos dinámicos iniciales.

6. Ejecutar en desarrollo
npm run dev

CONFIGURACION PARA SUPER_USUARIO
-Regístrate normalmente en tu web.
-Usa este comando rápido para darte permisos de Admin directamente en la base de datos (reemplaza tu correo):
Bash
  npx prisma db execute --stdin <<EOF
  UPDATE User SET role = 'SUPER_USER' WHERE email = 'tu_correo@ejemplo.com';
  EOF

 Variables de entorno
Variable	Descripción
DATABASE_URL	Ruta SQLite (file:./dev.db)
NEXTAUTH_SECRET	Llave secreta de sesión
NEXTAUTH_URL	URL base del sistema

---- Decisiones Técnicas-----
 Arquitectura
Next.js (App Router)
SSR para seguridad y rendimiento en rutas protegidas
Prisma v5
Tipado fuerte + rendimiento optimizado
Tailwind CSS
UI moderna con diseño consistente (#0961ff)

 Base de Datos
SQLite
Setup rápido
Ideal para pruebas técnicas
Sin dependencias externas
 ESM + TypeScript

El proyecto usa ES Modules, por lo que:

Se usa ts-node/esm para ejecutar seeds
Compatible con entornos modernos de Node.js
 Optimizaciones
   Validación doble (cliente + servidor)
   Manejo de sesiones seguro
   UI reactiva con estados dinámicos
   Código preparado para escalar a producción
 Deploy (Producción)

El proyecto está preparado para:

PM2 → manejo de procesos
Nginx → reverse proxy
VPS (Vultr / Hostinger)

## Mejoras con tiempo
Con un poco mas de tiempo me hubiera gustado implementar actualizacion de parametros en el registro con valiacion por codigo de seguridad
mediante resend por decirlo de una manera, y algunos reportes para descargar segun la tareas , la prioridad , tiempo de solucion y demas.
Configuracion de perfil para guardar informacion personal estilo avatar.
Un CRUD para el super usuario y controlar tanto usuarios como tareas en su maxima capacidad.
--
## Autor
Desarrollado por Ragineer
 https://ragineer.com
