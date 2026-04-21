# Test 03 — Task Manager

**Full Stack con base de datos y autenticación**

| Stack | |
|---|---|
| Next.js 16 | App Router |
| TypeScript | Tailwind CSS |
| Prisma ORM | SQLite / PostgreSQL |
| NextAuth.js | bcryptjs |

---

## Contexto del reto

Un usuario debe poder registrarse, iniciar sesión y gestionar sus **tareas personales**. Las tareas tienen título, descripción, estado (pendiente / en progreso / completada) y fecha límite. Cada usuario solo ve sus propias tareas.

Para la base de datos, **SQLite con Prisma es suficiente** y no requiere configuración de servidor. Si prefieres PostgreSQL (Supabase free tier o Railway), también es válido y suma puntos.

| Plazo | Trabajo estimado | Puntos totales |
|---|---|---|
| 3 días | 3–5 horas | 100 |

---

## Requerimientos base (obligatorios)

- [ ] **Autenticación funcional** — registro e inicio de sesión (email/password con NextAuth o equivalente)
- [ ] **CRUD completo de tareas**: crear, listar, editar estado y eliminar
- [ ] Cada tarea debe tener: **título, estado** (pendiente / en progreso / completada) y **fecha límite**
- [ ] Las tareas son **privadas por usuario** — no se pueden ver las de otro
- [ ] **API Routes correctamente protegidas** — no se puede operar sin sesión activa
- [ ] **Schema de Prisma** con migraciones incluidas en el repo
- [ ] **README** con instrucciones de instalación, variables de entorno necesarias y decisiones de diseño

---

## Extras para ir más allá (opcionales)

- [ ] Filtrar tareas por estado o fecha límite
- [ ] Drag & drop para reordenar o cambiar estado (estilo Kanban)
- [ ] Notificaciones o badges de tareas vencidas
- [ ] Optimistic UI — la UI se actualiza antes de confirmar con el servidor
- [ ] Unit o integration tests para los API routes
- [ ] Deploy con base de datos en la nube (Supabase, PlanetScale, Railway)
- [ ] Integrar un pequeño feature de IA — ej. sugerencia de prioridad o descripción automática

---

## Criterios de evaluación específicos

- **Schema de base de datos** y relaciones correctas
- **Protección de rutas API** (auth middleware)
- **Server Actions vs API Routes** — uso apropiado
- **Manejo de errores** y validación de inputs
- **Seguridad básica** — no exponer datos de otros usuarios

---

## Rúbrica de evaluación — 100 puntos

### 1. Funcionalidad (30 pts)

| Criterio | Puntos |
|---|---|
| El proyecto corre sin errores desde el primer intento | 12 |
| Todos los requerimientos base implementados | 10 |
| Edge cases manejados (inputs vacíos, errores de red) | 8 |

### 2. Calidad de código (25 pts)

| Criterio | Puntos |
|---|---|
| Estructura de carpetas y archivos clara | 7 |
| Componentes reutilizables, sin duplicación innecesaria | 7 |
| TypeScript correctamente tipado (sin `any` sin justificar) | 6 |
| Nombres de variables, funciones y componentes descriptivos | 5 |

### 3. Decisiones técnicas y README (20 pts)

| Criterio | Puntos |
|---|---|
| README completo con instrucciones y `.env.example` | 7 |
| Trade-offs explicados con criterio | 7 |
| "Qué haría con más tiempo" — honesto y con visión | 6 |

### 4. UX y UI (15 pts)

| Criterio | Puntos |
|---|---|
| La app es usable sin instrucciones previas | 6 |
| Loading y error states visibles y útiles | 5 |
| Diseño visual coherente (no necesita ser elaborado) | 4 |

### 5. Extras (10 pts)

| Criterio | Puntos |
|---|---|
| Features opcionales implementados y funcionales | 5 |
| Tests (unit o integration) | 3 |
| Deploy público funcionando | 2 |

> **Rechazo inmediato:** el proyecto no corre, dependencias rotas, no hay README, o el candidato no puede explicar su propio código en la revisión técnica.

---

## Cómo empezar

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env

# 3. Definir tus modelos en prisma/schema.prisma, luego ejecutar la migración
npx prisma migrate dev --name init

# 4. Levantar el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## Variables de entorno

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | URL de conexión a la base de datos. Para SQLite: `file:./dev.db` |
| `NEXTAUTH_SECRET` | Secret para NextAuth. Genera uno con `openssl rand -base64 32` |
| `NEXTAUTH_URL` | URL base de tu app. En desarrollo: `http://localhost:3000` |

Copia `.env.example` a `.env` y reemplaza los valores.

---

## Estructura del proyecto

```
test-03-task-manager/
├── app/
│   ├── layout.tsx           # Layout raíz
│   ├── page.tsx             # Página principal (empieza aquí)
│   └── globals.css          # Estilos globales con Tailwind
├── components/              # Tus componentes van aquí
├── lib/
│   ├── auth.ts              # Configuración de NextAuth (por configurar)
│   ├── prisma.ts            # Singleton del cliente Prisma (listo)
│   └── generated/prisma/    # Cliente Prisma generado (auto-generado)
├── prisma/
│   └── schema.prisma        # Schema de Prisma (define tus modelos aquí)
├── prisma.config.ts         # Configuración de Prisma
└── public/                  # Assets estáticos
```

### Lo que ya está configurado

- **Prisma** inicializado con SQLite como provider
- **`lib/prisma.ts`** — singleton del cliente Prisma para evitar múltiples conexiones en desarrollo
- **`lib/auth.ts`** — archivo placeholder para tu configuración de NextAuth
- **`prisma/schema.prisma`** — schema con ejemplo comentado de modelos `User` y `Task`
- **NextAuth**, **bcryptjs** y **@types/bcryptjs** ya instalados

### Paquetes ya instalados

- **`@prisma/client`** — Cliente de Prisma para queries a la base de datos
- **`prisma`** (dev) — CLI de Prisma para migraciones y generación de cliente
- **`next-auth`** — Autenticación para Next.js
- **`bcryptjs`** — Hashing de contraseñas (con `@types/bcryptjs` para TypeScript)
- **`dotenv`** (dev) — Carga de variables de entorno para `prisma.config.ts`

### Recursos útiles

- [Prisma — Getting Started with SQLite](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-sqlite)
- [NextAuth.js — Getting Started](https://next-auth.js.org/getting-started/example)
- [NextAuth.js — Credentials Provider](https://next-auth.js.org/providers/credentials)
- [Next.js — Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Next.js — Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)

---

## Reglas generales

### Lo que sí puedes usar

- Cualquier herramienta de IA: Cursor, Claude Code, GitHub Copilot, ChatGPT — sin restricciones
- Cualquier librería de npm que consideres apropiada
- Documentación oficial, Stack Overflow, blogs técnicos
- Tutoriales y referencias en línea

### Lo que no puedes hacer

- Entregar código de un tercero sin entenderlo — se evaluará en la revisión técnica
- Clonar un proyecto existente que resuelva exactamente el mismo problema
- No documentar nada — el README es obligatorio

> Usas IA, está bien. Lo que evaluamos es si entiendes lo que construiste, por qué tomaste cada decisión y cómo lo extenderías. La revisión técnica post-entrega es donde eso sale a la luz.

---

## Instrucciones de entrega

1. Crea un **repositorio público en GitHub** y envía el link antes de que venzan los 3 días
2. El proyecto debe correr con `npm install` y `npm run dev` sin pasos adicionales no documentados
3. Las variables de entorno deben estar documentadas en un archivo `.env.example`
4. El README debe incluir: qué construiste, cómo correrlo, decisiones técnicas tomadas, qué harías con más tiempo
5. Si hiciste deploy, incluye la URL en el README

---

## Estructura esperada de tu README

```markdown
## ¿Qué construí?
Descripción breve del proyecto y el test elegido.

## Cómo correrlo
Pasos concretos desde cero (incluyendo migraciones de la DB).

## Variables de entorno
Lista y descripción de cada variable en .env.example.

## Decisiones técnicas
¿Por qué elegiste X librería sobre Y? ¿Qué trade-offs hiciste?
¿SQLite o PostgreSQL y por qué? ¿Credentials o OAuth?

## Qué haría con más tiempo
Sé honesto. Esto nos importa tanto como lo que sí entregaste.
```

---

## La revisión técnica post-entrega

Una vez revisado el código, agendaremos una llamada de **30–45 minutos**. No es otro examen — es una conversación. Vamos a preguntarte cosas como:

- "Explícame cómo funciona esta parte de tu código"
- "¿Por qué usaste este approach y no este otro?"
- "Si tuvieras que agregar [feature X], ¿cómo lo harías?"
- "¿Qué parte te resultó más difícil y cómo la resolviste?"
- "¿Qué cambiarías del diseño si tuvieras que escalar esto?"

El objetivo es entender tu proceso de pensamiento, no hacerte tropezar. Si usaste IA para una parte, no hay problema — cuéntanos cómo la usaste y qué aprendiste del resultado.
