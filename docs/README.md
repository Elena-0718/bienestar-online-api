# Bienestar Online API

API REST desarrollada con **NestJS** para la gestión integral de una plataforma de bienestar online. El sistema centraliza funcionalidades de autenticación, usuarios, profesionales, productos, carrito de compras, órdenes, pagos, suscripciones, planes nutricionales, planes de entrenamiento, consultas, progreso del usuario y soporte.

Este backend está diseñado como una solución modular para una aplicación orientada a servicios de salud, nutrición, entrenamiento físico y comercio electrónico de productos relacionados con bienestar.

---

## Tabla de contenido

* [Descripción general](#descripción-general)
* [Objetivo del proyecto](#objetivo-del-proyecto)
* [Características principales](#características-principales)
* [Arquitectura del backend](#arquitectura-del-backend)
* [Tecnologías utilizadas](#tecnologías-utilizadas)
* [Roles del sistema](#roles-del-sistema)
* [Módulos implementados](#módulos-implementados)
* [Documentación de endpoints](#documentación-de-endpoints)
* [Modelo general de datos](#modelo-general-de-datos)
* [Instalación y ejecución](#instalación-y-ejecución)
* [Variables de entorno](#variables-de-entorno)
* [Documentación Swagger](#documentación-swagger)
* [Estructura del proyecto](#estructura-del-proyecto)
* [Buenas prácticas implementadas](#buenas-prácticas-implementadas)
* [Mejoras futuras](#mejoras-futuras)
* [Autora](#autora)

---

## Descripción general

**Bienestar Online API** es el backend de una plataforma digital orientada al acompañamiento de usuarios en procesos de bienestar, nutrición y actividad física. La aplicación permite gestionar usuarios, profesionales, planes personalizados, consultas, progreso físico, productos, carrito de compras, órdenes, pagos, entregas y suscripciones.

El sistema contempla una arquitectura basada en módulos independientes, con separación de responsabilidades entre controladores, servicios, entidades, DTOs, guards e interceptores. Además, implementa autenticación, autorización basada en roles y documentación interactiva mediante Swagger.

---

## Objetivo del proyecto

El objetivo principal es construir una API robusta y escalable que permita soportar una plataforma de bienestar online con tres líneas funcionales principales:

1. **Servicios profesionales de bienestar**
   Gestión de profesionales, consultas, planes nutricionales, planes de entrenamiento y seguimiento del progreso del usuario.

2. **Comercio electrónico**
   Gestión de productos, categorías, carrito de compras, órdenes, pagos y entregas.

3. **Modelo de suscripción**
   Administración de planes, suscripciones activas y control del estado de los usuarios suscritos.

---

## Características principales

* Registro e inicio de sesión de usuarios.
* Autenticación con JWT.
* Recuperación y cambio de contraseña.
* Control de acceso por roles.
* Gestión de usuarios y perfiles.
* Subida de foto de perfil.
* Administración de productos y categorías.
* Carrito de compras activo por usuario.
* Creación de órdenes desde el carrito.
* Gestión de detalles de órdenes.
* Registro y confirmación de pagos.
* Gestión de entregas.
* Creación y administración de suscripciones.
* Gestión de planes comerciales.
* Registro y aprobación de profesionales.
* Creación de planes nutricionales personalizados.
* Creación de planes de entrenamiento personalizados.
* Registro y consulta de progreso físico del usuario.
* Programación y administración de consultas.
* Documentación automática con Swagger.

---

## Arquitectura del backend

El backend sigue una arquitectura modular propia de NestJS. Cada dominio funcional cuenta con sus propios controladores, servicios, entidades y DTOs.

La separación modular permite mantener el código organizado, mejorar la mantenibilidad y facilitar el crecimiento futuro del sistema.

### Capas principales

* **Controllers:** exponen los endpoints REST.
* **Services:** contienen la lógica de negocio.
* **DTOs:** validan y tipan los datos de entrada.
* **Entities:** representan las tablas y relaciones de la base de datos.
* **Guards:** protegen rutas según autenticación y roles.
* **Interceptors:** permiten transformar o manejar respuestas y procesos transversales.
* **Seeds:** permiten cargar información inicial para pruebas o desarrollo.

---

## Tecnologías utilizadas

* **Node.js**
* **NestJS**
* **TypeScript**
* **PostgreSQL**
* **TypeORM**
* **JWT** para autenticación
* **bcrypt** para cifrado de contraseñas
* **Swagger / OpenAPI 3.0** para documentación
* **Class Validator / Class Transformer** para validación de DTOs
* **Multer** o manejo de carga de archivos para imágenes
* **Nodemailer / Mailer** para recuperación de contraseña

---

## Roles del sistema

El sistema contempla distintos niveles de acceso:

### Usuario

Puede registrarse, iniciar sesión, actualizar su perfil, consultar productos, manejar su carrito, crear órdenes, registrar pagos, consultar suscripciones, revisar planes asignados, registrar progreso y agendar consultas.

### Profesional

Puede gestionar planes nutricionales o de entrenamiento asociados a usuarios, consultar pacientes asignados y participar en el seguimiento del proceso del usuario.

### Administrador

Puede gestionar usuarios, credenciales, roles, productos, categorías, órdenes, pagos, entregas, planes, suscripciones, profesionales y consultas.

---

## Módulos implementados

### Auth

Módulo encargado de la autenticación del sistema.

Incluye:

* Login.
* Registro de usuarios.
* Generación de tokens JWT.
* Validación de credenciales.

### Credentials

Módulo encargado de la administración de credenciales de acceso.

Incluye:

* Recuperación de contraseña.
* Restablecimiento mediante token.
* Cambio de contraseña.
* Activación y desactivación de cuentas.
* Cambio de rol por administrador.

### Users

Módulo para la gestión de usuarios.

Incluye:

* Consulta de usuarios.
* Consulta de perfil propio.
* Actualización de perfil.
* Subida de foto de perfil.
* Consulta de pacientes asignados por especialidad.

### Products

Módulo para la gestión de productos disponibles en la tienda.

Incluye:

* Listado público de productos activos.
* Consulta de producto por UUID.
* Creación, actualización y eliminación lógica por administrador.

### Categories

Módulo para clasificación de productos.

Incluye:

* Listado de categorías.
* Creación de categorías.
* Actualización de categorías.
* Eliminación de categorías.

### Cart

Módulo encargado del carrito de compras activo del usuario.

Incluye:

* Consulta del carrito activo.
* Vaciamiento del carrito.
* Consulta administrativa de carritos.

### Cart Details

Módulo encargado de los productos dentro del carrito.

Incluye:

* Agregar productos.
* Actualizar cantidades.
* Eliminar productos del carrito.

### Orders

Módulo encargado de la creación y administración de órdenes.

Incluye:

* Creación de orden desde el carrito activo.
* Historial de órdenes por usuario.
* Consulta de detalle de orden.
* Actualización de estado por administrador.
* Cancelación de órdenes.

### Order Details

Módulo para consultar los detalles asociados a una orden.

Incluye:

* Consulta administrativa de detalles de orden.
* Consulta del usuario sobre sus propios detalles de orden.

### Payments

Módulo encargado de los pagos.

Incluye:

* Registro de pagos.
* Confirmación de pagos.
* Actualización de estado.
* Consulta por UUID.
* Marcado de pago como fallido.

### Deliveries

Módulo encargado del seguimiento de entregas.

Incluye:

* Creación de entregas.
* Consulta de entregas.
* Actualización de estado.
* Consulta por UUID.

### Subscriptions

Módulo para la administración de suscripciones.

Incluye:

* Creación de suscripciones.
* Consulta de suscripciones.
* Actualización de estado.
* Actualización de fechas.

### Plans

Módulo para la administración de planes comerciales o de suscripción.

Incluye:

* Consulta de planes activos.
* Creación de planes.
* Actualización de planes.
* Desactivación de planes.

### Nutrition Plans

Módulo para gestión de planes nutricionales personalizados.

Incluye:

* Consulta del usuario sobre su propio plan nutricional.
* Creación de plan nutricional por profesional.
* Consulta de planes nutricionales de un usuario.
* Actualización y desactivación de planes.

### Workout Plans

Módulo para gestión de planes de entrenamiento personalizados.

Incluye:

* Creación de planes de entrenamiento.
* Consulta del usuario sobre sus propios entrenamientos.
* Consulta de planes por usuario.
* Actualización y desactivación de planes.

### Professionals

Módulo para la gestión de profesionales de bienestar.

Incluye:

* Registro de profesionales.
* Creación administrativa de profesionales.
* Subida de foto.
* Consulta pública o administrativa.
* Actualización.
* Aprobación.
* Desactivación.

### Progress

Módulo para el seguimiento del progreso físico del usuario.

Incluye:

* Registro de progreso.
* Consulta de progreso por usuario.
* Estadísticas.
* Actualización de registros.
* Eliminación lógica.

### Consultations

Módulo para la gestión de consultas entre usuarios y profesionales.

Incluye:

* Creación de consultas.
* Consulta de citas propias.
* Consulta de próximas citas.
* Gestión administrativa.
* Cancelación.
* Actualización de estado.
* Acceso a sesión o enlace de consulta.

### Support

Módulo de soporte para operaciones auxiliares.

Incluye:

* Consulta de producto por ID desde soporte.

---

## Documentación de endpoints

> Base URL local sugerida: `http://localhost:3002/api/docs`

### App

| Método | Endpoint | Descripción             | Acceso  |
| ------ | -------- | ----------------------- | ------- |
| GET    | `/api`   | Endpoint base de la API | Público |

---

### Auth

| Método | Endpoint            | Descripción       | Acceso  |
| ------ | ------------------- | ----------------- | ------- |
| POST   | `/api/auth/login`   | Iniciar sesión    | Público |
| POST   | `/api/auth/sign-up` | Registrar usuario | Público |

---

### Credenciales

| Método | Endpoint                                  | Descripción                                             | Acceso              |
| ------ | ----------------------------------------- | ------------------------------------------------------- | ------------------- |
| POST   | `/api/credentials/forgot-password`        | Solicitar recuperación de contraseña                    | Público             |
| PATCH  | `/api/credentials/reset-password-token`   | Restablecer contraseña mediante token enviado al correo | Público             |
| GET    | `/api/credentials/all`                    | Obtener todas las credenciales                          | Admin               |
| GET    | `/api/credentials/{uuid}`                 | Obtener credencial por UUID                             | Admin               |
| PATCH  | `/api/credentials/change-password/{uuid}` | Cambiar contraseña                                      | Propietario         |
| DELETE | `/api/credentials/desactivate/{uuid}`     | Desactivar cuenta                                       | Propietario o Admin |
| PUT    | `/api/credentials/activate/{uuid}`        | Activar cuenta                                          | Admin               |
| PUT    | `/api/credentials/change-role/{uuid}`     | Cambiar rol                                             | Admin               |

---

### Usuarios

| Método | Endpoint                       | Descripción                                  | Acceso              |
| ------ | ------------------------------ | -------------------------------------------- | ------------------- |
| GET    | `/api/users/all`               | Obtener todos los usuarios                   | Admin               |
| GET    | `/api/users/find/{uuid}`       | Obtener usuario por UUID                     | Admin o Profesional |
| GET    | `/api/users/my-patients`       | Obtener pacientes asignados por especialidad | Profesional         |
| GET    | `/api/users/my-profile`        | Ver perfil propio                            | Usuario autenticado |
| PUT    | `/api/users/update-my-profile` | Actualizar perfil propio                     | Usuario autenticado |
| POST   | `/api/users/upload`            | Subir foto de perfil                         | Usuario autenticado |

---

### Productos

| Método | Endpoint                      | Descripción                               | Acceso  |
| ------ | ----------------------------- | ----------------------------------------- | ------- |
| GET    | `/api/products/all`           | Obtener todos los productos activos       | Público |
| GET    | `/api/products/{uuid}`        | Obtener producto por UUID                 | Público |
| POST   | `/api/products/create`        | Crear producto                            | Admin   |
| PATCH  | `/api/products/update/{uuid}` | Actualizar producto                       | Admin   |
| DELETE | `/api/products/delete/{uuid}` | Eliminar producto mediante borrado lógico | Admin   |

---

### Categorías

| Método | Endpoint                 | Descripción                  | Acceso  |
| ------ | ------------------------ | ---------------------------- | ------- |
| GET    | `/api/categories`        | Obtener todas las categorías | Público |
| POST   | `/api/categories`        | Crear categoría              | Admin   |
| GET    | `/api/categories/{uuid}` | Obtener categoría por UUID   | Público |
| PATCH  | `/api/categories/{uuid}` | Actualizar categoría         | Admin   |
| DELETE | `/api/categories/{uuid}` | Eliminar categoría           | Admin   |

---

### Carrito

| Método | Endpoint           | Descripción               | Acceso  |
| ------ | ------------------ | ------------------------- | ------- |
| GET    | `/api/cart`        | Obtener carrito activo    | Usuario |
| DELETE | `/api/cart/empty`  | Vaciar carrito activo     | Usuario |
| GET    | `/api/cart/all`    | Listar todos los carritos | Admin   |
| GET    | `/api/cart/{uuid}` | Obtener carrito por UUID  | Admin   |

---

### Detalles del carrito

| Método | Endpoint                                           | Descripción                        | Acceso  |
| ------ | -------------------------------------------------- | ---------------------------------- | ------- |
| POST   | `/api/cart-details/add-product`                    | Agregar producto al carrito activo | Usuario |
| PUT    | `/api/cart-details/update-product-quantity/{uuid}` | Actualizar cantidad de producto    | Usuario |
| DELETE | `/api/cart-details/delete-product/{uuid}`          | Eliminar producto del carrito      | Usuario |

---

### Delivery

| Método | Endpoint                        | Descripción                  | Acceso                     |
| ------ | ------------------------------- | ---------------------------- | -------------------------- |
| GET    | `/api/deliveries/all`           | Obtener todas las entregas   | Admin                      |
| POST   | `/api/deliveries`               | Crear entrega                | Admin / Sistema            |
| PUT    | `/api/deliveries/{uuid}/status` | Actualizar estado de entrega | Admin                      |
| GET    | `/api/deliveries/{uuid}`        | Obtener entrega por UUID     | Admin / Usuario autorizado |

---

### Órdenes

| Método | Endpoint                    | Descripción                                | Acceso              |
| ------ | --------------------------- | ------------------------------------------ | ------------------- |
| GET    | `/api/orders`               | Obtener todas las órdenes                  | Admin               |
| POST   | `/api/orders`               | Crear orden desde el carrito activo        | Usuario             |
| PATCH  | `/api/orders/{uuid}/status` | Actualizar estado de una orden             | Admin               |
| DELETE | `/api/orders/{uuid}`        | Cancelar una orden                         | Admin               |
| GET    | `/api/orders/{uuid}`        | Obtener detalle de una orden               | Admin o propietario |
| GET    | `/api/orders/my-orders`     | Consultar historial de órdenes del usuario | Usuario             |
| PATCH  | `/api/orders/{uuid}/cancel` | Cancelar orden propia                      | Usuario             |

---

### Detalles de orden

| Método | Endpoint                          | Descripción                      | Acceso  |
| ------ | --------------------------------- | -------------------------------- | ------- |
| GET    | `/api/order-details/admin/{uuid}` | Ver detalles de una orden        | Admin   |
| GET    | `/api/order-details/user/{uuid}`  | Ver detalles de una orden propia | Usuario |

---

### Pagos

| Método | Endpoint                             | Descripción                | Acceso          |
| ------ | ------------------------------------ | -------------------------- | --------------- |
| GET    | `/api/payments/all`                  | Obtener todos los pagos    | Admin           |
| PUT    | `/api/payments/confirm/{uuid}`       | Confirmar pago             | Admin           |
| PUT    | `/api/payments/update-status/{uuid}` | Actualizar estado del pago | Admin           |
| DELETE | `/api/payments/delete/{uuid}`        | Marcar pago como fallido   | Admin           |
| POST   | `/api/payments/checkout`             | Registrar un pago          | Usuario         |
| GET    | `/api/payments/{uuid}`               | Obtener pago por UUID      | Admin o Usuario |

---

### Suscripciones

| Método | Endpoint                           | Descripción                      | Acceso                     |
| ------ | ---------------------------------- | -------------------------------- | -------------------------- |
| POST   | `/api/subscriptions`               | Crear suscripción                | Usuario / Admin            |
| GET    | `/api/subscriptions`               | Obtener todas las suscripciones  | Admin                      |
| GET    | `/api/subscriptions/{uuid}`        | Obtener suscripción por UUID     | Admin / Usuario autorizado |
| PUT    | `/api/subscriptions/status/{uuid}` | Actualizar estado de suscripción | Admin                      |
| PUT    | `/api/subscriptions/dates/{uuid}`  | Actualizar fechas de suscripción | Admin                      |

---

### Plans

| Método | Endpoint            | Descripción              | Acceso  |
| ------ | ------------------- | ------------------------ | ------- |
| GET    | `/api/plans/active` | Obtener planes activos   | Público |
| GET    | `/api/plans`        | Obtener todos los planes | Admin   |
| POST   | `/api/plans`        | Crear plan               | Admin   |
| GET    | `/api/plans/{uuid}` | Obtener plan por UUID    | Admin   |
| PATCH  | `/api/plans/{uuid}` | Actualizar plan          | Admin   |
| DELETE | `/api/plans/{uuid}` | Desactivar plan          | Admin   |

---

### Nutrition Plans

| Método | Endpoint                                | Descripción                                | Acceso                                   |
| ------ | --------------------------------------- | ------------------------------------------ | ---------------------------------------- |
| GET    | `/api/nutrition-plans/my-nutrition`     | Usuario obtiene su propio plan nutricional | Usuario                                  |
| POST   | `/api/nutrition-plans/{professionalId}` | Crear plan nutricional                     | Profesional                              |
| GET    | `/api/nutrition-plans/user/{userUuid}`  | Obtener planes nutricionales de un usuario | Profesional / Admin                      |
| GET    | `/api/nutrition-plans/{uuid}`           | Obtener plan nutricional por UUID          | Usuario autorizado / Profesional / Admin |
| PATCH  | `/api/nutrition-plans/{uuid}`           | Actualizar plan nutricional                | Profesional / Admin                      |
| DELETE | `/api/nutrition-plans/{uuid}`           | Desactivar plan nutricional                | Profesional / Admin                      |

---

### Profesionales

| Método | Endpoint                               | Descripción                            | Acceso                        |
| ------ | -------------------------------------- | -------------------------------------- | ----------------------------- |
| POST   | `/api/professionals/admin`             | Crear profesional desde administración | Admin                         |
| POST   | `/api/professionals/upload-photo`      | Subir foto de profesional              | Profesional / Admin           |
| POST   | `/api/professionals`                   | Registrar profesional                  | Público / Usuario autenticado |
| GET    | `/api/professionals`                   | Obtener profesionales                  | Público / Admin               |
| GET    | `/api/professionals/{uuid}`            | Obtener profesional por UUID           | Público / Admin               |
| PATCH  | `/api/professionals/{uuid}`            | Actualizar profesional                 | Profesional / Admin           |
| DELETE | `/api/professionals/{uuid}`            | Eliminar o desactivar profesional      | Admin                         |
| PATCH  | `/api/professionals/{uuid}/approve`    | Aprobar profesional                    | Admin                         |
| PATCH  | `/api/professionals/{uuid}/deactivate` | Desactivar profesional                 | Admin                         |

---

### Workout Plans

| Método | Endpoint                         | Descripción                                 | Acceso                                   |
| ------ | -------------------------------- | ------------------------------------------- | ---------------------------------------- |
| POST   | `/api/workouts/{professionalId}` | Crear plan de entrenamiento                 | Profesional                              |
| GET    | `/api/workouts/my-workouts`      | Usuario obtiene sus planes de entrenamiento | Usuario                                  |
| GET    | `/api/workouts/user/{userUuid}`  | Profesional obtiene planes de un usuario    | Profesional / Admin                      |
| GET    | `/api/workouts/{uuid}`           | Obtener plan de entrenamiento por UUID      | Usuario autorizado / Profesional / Admin |
| PATCH  | `/api/workouts/{uuid}`           | Actualizar plan de entrenamiento            | Profesional / Admin                      |
| DELETE | `/api/workouts/{uuid}`           | Desactivar plan de entrenamiento            | Profesional / Admin                      |

---

### Progress

| Método | Endpoint                         | Descripción                                 | Acceso                                   |
| ------ | -------------------------------- | ------------------------------------------- | ---------------------------------------- |
| GET    | `/api/progress/stats/{userUuid}` | Obtener estadísticas de progreso de usuario | Profesional / Admin                      |
| POST   | `/api/progress/{userUuid}`       | Crear registro de progreso                  | Usuario / Profesional                    |
| GET    | `/api/progress/{uuid}`           | Obtener registro de progreso por UUID       | Usuario autorizado / Profesional / Admin |
| PATCH  | `/api/progress/{uuid}`           | Actualizar registro de progreso             | Usuario autorizado / Profesional / Admin |
| DELETE | `/api/progress/{uuid}`           | Eliminar registro de progreso               | Usuario autorizado / Admin               |
| GET    | `/api/progress/user/{userUuid}`  | Obtener progreso de un usuario              | Usuario autorizado / Profesional / Admin |

---

### Consultation

| Método | Endpoint                                 | Descripción                              | Acceso                                   |
| ------ | ---------------------------------------- | ---------------------------------------- | ---------------------------------------- |
| GET    | `/api/consultations/admin/all`           | Obtener todas las consultas              | Admin                                    |
| PATCH  | `/api/consultations/admin/{uuid}`        | Actualizar consulta desde administración | Admin                                    |
| PATCH  | `/api/consultations/admin/{uuid}/cancel` | Cancelar consulta desde administración   | Admin                                    |
| POST   | `/api/consultations`                     | Crear consulta                           | Usuario                                  |
| GET    | `/api/consultations`                     | Obtener consultas                        | Usuario autenticado                      |
| GET    | `/api/consultations/me`                  | Obtener mis consultas                    | Usuario                                  |
| GET    | `/api/consultations/me/upcoming`         | Obtener próximas consultas               | Usuario                                  |
| GET    | `/api/consultations/professional/{uuid}` | Obtener consultas por profesional        | Profesional / Admin                      |
| GET    | `/api/consultations/{uuid}`              | Obtener consulta por UUID                | Usuario autorizado / Profesional / Admin |
| PATCH  | `/api/consultations/{uuid}`              | Actualizar consulta                      | Usuario autorizado / Profesional / Admin |
| DELETE | `/api/consultations/{uuid}`              | Eliminar o cancelar consulta             | Usuario autorizado / Admin               |
| GET    | `/api/consultations/{uuid}/join`         | Acceder a la consulta                    | Usuario autorizado / Profesional         |

---

### Support

| Método | Endpoint                      | Descripción                           | Acceso            |
| ------ | ----------------------------- | ------------------------------------- | ----------------- |
| GET    | `/api/support/getProductById` | Obtener producto por ID desde soporte | Interno / Soporte |

---

## Modelo general de datos

El sistema maneja entidades relacionadas con los siguientes dominios:

### Seguridad y usuarios

* Usuario
* Credencial
* Rol

### Comercio electrónico

* Producto
* Categoría
* Carrito
* Detalle de carrito
* Orden
* Detalle de orden
* Pago
* Entrega

### Servicios de bienestar

* Profesional
* Consulta
* Plan nutricional
* Plan de entrenamiento
* Progreso del usuario

### Suscripciones

* Plan
* Suscripción

---

## Flujo funcional principal

### Flujo de compra

1. El usuario inicia sesión.
2. Consulta productos activos.
3. Agrega productos al carrito.
4. Actualiza cantidades si es necesario.
5. Crea una orden desde el carrito activo.
6. Registra el pago mediante checkout.
7. El administrador confirma o actualiza el estado del pago.
8. Se gestiona la entrega asociada.

### Flujo de bienestar

1. El usuario se registra e inicia sesión.
2. El usuario puede agendar una consulta con un profesional.
3. El profesional puede crear planes nutricionales o de entrenamiento.
4. El usuario puede consultar sus planes asignados.
5. El sistema permite registrar y consultar progreso físico.

### Flujo administrativo

1. El administrador gestiona usuarios y roles.
2. Administra productos, categorías, planes y profesionales.
3. Revisa órdenes, pagos, entregas y suscripciones.
4. Aprueba o desactiva profesionales.
5. Supervisa consultas y estados operativos.

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_PROYECTO>
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example` si está disponible.

### 4. Ejecutar en modo desarrollo

```bash
npm run start:dev
```

### 5. Ejecutar en modo producción

```bash
npm run build
npm run start:prod
```

---

## Variables de entorno



```env
PORT=3002

DB_NAME=nestdb
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=Micontraseña

JWT_SECRET= Mysecreto
JWT_EXPIRES_IN=1d

MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=your_email@example.com
MAIL_PASSWORD=your_email_password
MAIL_FROM=Bienestar Online <no-reply@bienestaronline.com>
```

> Ajustar los nombres de variables según la configuración real del proyecto.

---

## Documentación Swagger

La API cuenta con documentación interactiva generada con Swagger / OpenAPI 3.0.

Una vez el servidor esté en ejecución, acceder a:

```txt
http://localhost:3002/api/docs
```

Desde Swagger se pueden consultar los módulos, probar endpoints y validar los DTOs disponibles.


---

## Estructura del proyecto

Estructura referencial basada en los módulos principales:

```txt
src/
├── auth/
├── credentials/
├── users/
├── products/
├── categories/
├── cart/
├── cart-detail/
├── orders/
├── order-detail/
├── payments/
├── deliveries/
├── subscriptions/
├── plans/
├── nutrition-plans/
├── workouts/
├── professionals/
├── progress/
├── consultations/
├── support/
├── guards/
├── interceptors/
├── seeds/
├── app.module.ts
└── main.ts
```

---

## Buenas prácticas implementadas

* Arquitectura modular basada en dominios.
* Separación entre controladores, servicios, DTOs y entidades.
* Uso de TypeScript para tipado estático.
* Validación de datos mediante DTOs.
* Autenticación basada en JWT.
* Autorización por roles.
* Borrado lógico en entidades sensibles como productos y cuentas.
* Documentación de API con Swagger.
* Uso de UUID para identificación pública de recursos.
* Gestión diferenciada de permisos para usuario, profesional y administrador.
* Organización de flujos reales de negocio: ecommerce, pagos, suscripciones y servicios personalizados.

---

## Mejoras futuras

* Implementar pruebas unitarias y de integración.
* Dockerizar la aplicación y la base de datos.
* Agregar pipeline CI/CD con GitHub Actions.
* Desplegar backend en Render, Railway, Fly.io o similar.
* Desplegar base de datos en Neon, Supabase o Railway PostgreSQL.
* Implementar refresh tokens.
* Mejorar logs y monitoreo.
* Agregar paginación, filtros y ordenamiento en listados administrativos.
* Implementar auditoría de cambios en entidades críticas.
* Integrar pasarela de pagos real.
* Agregar notificaciones por correo para órdenes, consultas y suscripciones.
* Mejorar cobertura de Swagger con ejemplos de request y response.

---

## Estado del proyecto

Proyecto académico funcional en evolución, desarrollado como backend para una plataforma integral de bienestar online.

El sistema ya cuenta con una base modular sólida y múltiples dominios implementados. Actualmente puede ser utilizado como proyecto de portafolio backend junior, especialmente para demostrar conocimientos en NestJS, APIs REST, autenticación, autorización, modelado de datos y lógica de negocio.

---

## Autora

*Norida Elena Rueda Peña*
Proyecto académico desarrollado como parte de formación en análisis y desarrollo de software.

---


