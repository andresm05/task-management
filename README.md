# Descripción del Proyecto

El Sistema de Gestión de Tareas es una aplicación diseñada para facilitar la organización, asignación y seguimiento de tareas dentro de proyectos. El sistema permite a los usuarios gestionar transacciones, maestros y usuarios con roles diferenciados (ADMIN y USER), asegurando control y accesibilidad según los permisos definidos. Este proyecto está construido con tecnologías modernas como Next.js, TypeScript, Tailwind CSS, Prisma, GraphQL y Supabase.

# Funcionalidades Principales

### Autenticación de Usuarios
- Inicio de sesión seguro.
- Diferenciación de roles: ADMIN y USER.
- Gestión de Transacciones

### Visualización de movimientos relacionados con un Usuario.
- Creación de nuevas tareas con actualizaciones.
- Gráfica de evolución de tareas.
- Gestión de Usuarios
- Visualización de todos los usuarios con detalles como tarea y responsable.
- Creación de nuevos usuarios (solo para usuarios ADMIN).

### Gestión de Usuarios
- Visualización y modificación de roles (solo para usuarios ADMIN).

# Sidebar
### Navegación constante con enlaces a las secciones principales:
- Gestión de usuarios (ADMIN).
- Análisis de datos (ADMIN y USER).
- Gestión de Proyectos (ADMIN y USER).

# Tecnologías Usadas
- Framework Frontend: Next.js
- Lenguaje: TypeScript
- Estilos: Tailwind CSS
- ORM: Prisma
- Base de Datos: Supabase
- API: GraphQL con Apollo Server v4
- Gestión de Paquetes: Yarn

## Instrucciones de Configuración

#### Clonar el Repositorio

Copiar código

```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_PROYECTO>
```

#### Instalar Dependencias

Copiar código
```bash
yarn install
```

#### Configurar la Base de Datos
Crear una base de datos en Supabase.
Configurar la variable de entorno DATABASE_URL en un archivo .env:

Copiar código
```bash
DATABASE_URL=tu_string_de_conexion
```

#### Ejecutar Migraciones
Inicializar las tablas de la base de datos:

Copiar código
```bash
npx prisma migrate dev --name migracion-inicial
```

#### Iniciar el Servidor

Copiar código
```bash
yarn dev
```
Acceder al sistema en: http://localhost:3000

## Estructura del Proyecto


```
/src/pages                 -> Páginas de Next.js.
/src/pages/api/graphql     -> API GraphQL con Apollo Server.
/src/components & /molecules -> Componentes reutilizables.
/prisma                    -> Esquema y scripts de datos de Prisma.
/graphql                   -> Esquema y resolvers de GraphQL.
/utils                     -> Funciones de utilidad.
/hooks/useMiddleware       -> Hook personalizado para autenticación frontend.
/src/lib/auth              -> Middleware de autenticación backend.
/styles                    -> Estilos globales y módulos CSS.
/public                    -> Archivos estáticos.
/lib                       -> Clientes de Apollo y Prisma.
```

# Despliegue 

```bash
https://task-management-omega-one.vercel.app/
```

### Contacto

Para preguntas o soporte, contactar al equipo de desarrollo en: 
```
allejo007@gmail.com
jaime.munozq@udea.edu.co 
```


