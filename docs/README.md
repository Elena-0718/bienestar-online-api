
# Bienestar Online

1 Idea del negocio y sus actividades

Bienestar Online es un espacio virtual diseñado para promover la salud y el bienestar integral a traves de la actividad física y la nutrición personalizada. La plataforma busca acompañar al usuario en el logro de sus objetivos, como:

* Aumento de masa muscular
* Perdida de perso
* Mantenimiento de la condición física
* Prevención y tratamiento de enfermedades no trasmisibles.

En la plataforma, los usuarios encontraran servicios especializados que se personalizaran dependiendo de las necesidades, condiciones y metas de cada uno.

* Asesorias de entrenador fisico.
* Asesorias nutricionales
* Tienda de suplementos.

El acceso a la plataforma se realizara por:
* Suscripción, (Mensual o anual), que incluira un acompañamiento continuo. 
* Pago por sesión individual (nutrición o entrenamiento) 
* Compra directa de productos o suplementos 
* Acceso gratuito para informacion general sobre los beneficios de la nutrición adecuda y actividad fisica regular, mediante articulos, enlaces videos, basados en evidencia cientifica.

La plataforma tendra dos roles inicialmente, que seran administrador y usuario, cada uno con funcionalidades diferentes, las cuales se describen acontinuación.

USUARIO: 

* Registro y perfil
* Acceso a servicios
* Acceso a productos
* Realizar pagos 
* Descargar facturas
* Seguimiento a su proceso, mediante los planes de nutricion y entrenamiento asignados.
* Soporte y comunicación

ADMINISTRADOR:

* Gestión de usuarios
* Gestión de profesionales
* Gestión de servicios
* Gestión de productos
* Gestión de pagos
* Reportes y estadisticas
* Soporyte y comunicación

2 Rutas usuario / admin

👤 RUTAS USUARIO

* Registro y perfil

POST /usuario/registro → crear cuenta

POST /usuario/login → iniciar sesión

GET /usuario/perfil → ver perfil

PATCH /usuario/perfil → actualizar datos

* Servicios (asesorías y suscripción)

GET /usuario/servicios → listar servicios disponibles (nutrición, entrenamiento)

POST /usuario/servicios/reservar/:id → reservar sesión

POST /usuario/suscripcion → comprar suscripción

GET /usuario/mis-servicios → ver historial de servicios usados

* Productos (suplementos)

GET /usuario/productos → listar productos disponibles

POST /usuario/carrito/agregar/:id → agregar producto al carrito

GET /usuario/carrito → ver carrito actual

DELETE /usuario/carrito/eliminar/:id → quitar producto del carrito

POST /usuario/pedido → confirmar compra de carrito

* Pagos

POST /usuario/pagos → realizar pago (servicio, suscripción o producto)

GET /usuario/pagos/:id → ver detalle de un pago

GET /usuario/mis-pagos → historial de pagos

* Progreso y seguimiento

GET /usuario/progreso → ver indicadores de progreso (peso, IMC, etc.)

POST /usuario/progreso → actualizar medidas/progreso

* Comunicación y soporte

GET /usuario/notificaciones → ver notificaciones recibidas

POST /usuario/mensajes → enviar mensajes a administrador

🛠️ RUTAS ADMINISTRADOR

* Gestión de usuarios

GET /admin/usuarios → listar usuarios registrados

GET /admin/usuarios/:id → ver detalle de un usuario

PATCH /admin/usuarios/:id → editar usuario

DELETE /admin/usuarios/:id → desactivar usuario

* Gestión de profesionales

POST /admin/profesionales → registrar entrenador/nutricionista

GET /admin/profesionales → listar profesionales

PATCH /admin/profesionales/:id → actualizar información

DELETE /admin/profesionales/:id → eliminar o inactivar

* Gestión de servicios

POST /admin/servicios → crear servicio nuevo

GET /admin/servicios → listar servicios

PATCH /admin/servicios/:id → editar servicio

DELETE /admin/servicios/:id → eliminar servicio

* Gestión de productos

POST /admin/productos → agregar producto nuevo

GET /admin/productos → listar productos

PATCH /admin/productos/:id → actualizar producto

DELETE /admin/productos/:id → eliminar producto

* Gestión de pagos y reportes

GET /admin/pagos → listar todos los pagos realizados

GET /admin/pagos/:id → detalle de un pago

GET /admin/reportes/financieros → reportes de ingresos

GET /admin/reportes/actividad → reportes de uso de servicios

* Comunicación y soporte

GET /admin/mensajes → ver mensajes de usuarios

POST /admin/notificaciones → enviar notificaciones/promociones

3 Identidades

* Credencial
id_credencial INT AUTO_INCREMENT PK,

id_usuario INT FK,

contraseña VARCHAR(20)

* Usuarios
id_usuario INT AUTO_INCREMENT PK,

nombre VARCHAR(100) NOT NULL,

apellido VARCHAR(100) NOT NULL,

email VARCHAR(100) NOT NULL,

telefono VARCHAR(20) NOT NULL,

fecha_nacimiento DATE NOT NULL,

genero ENUM('masculino','femenino','otro') NOT NULL,

objetivo TEXT 

estado ENUM('activo','inactivo') NOT NULL,

rol ENUM('usuario','administrador') NOT NULL,

* Profesionales

id_profesional INT AUTO_INCREMENT PK,

id_usuario INT FK,

nombre VARCHAR(100) NOT NULL,

apellido VARCHAR(100) NOT NULL,

especialidad ENUM('nutrición','entrenamiento físico') NOT NULL,

email VARCHAR(100) NOT NULL,

telefono VARCHAR(20),

* Horario

id_horario INT AUTO_INCREMENT PK,

id_profesional INT FK,

fecha DATE NOT NULL,

hora_inicio TIME NOT NULL,

hora_fin TIME NOT NULL,

numero_consultas_hora INT NOT NULL

disponible BOOLEAN

* Servicios

id_servicio INT AUTO_INCREMENT PK,

id_usuario INT FK,

nombre_servicio VARCHAR(100) NOT NULL,

descripcion TEXT NOT NULL, 

precio DECIMAL(10,2) NOT NULL,

* Productos

id_producto INT AUTO_INCREMENT PK,

id_usuario INT FK,

nombre_producto VARCHAR(100) NOT NULL,

descripcion TEXTNOT NULL,

precio DECIMAL(10,2) NOT NULL,

stock INT NOT NULL,

estado ENUM('disponible','no disponible') 


* Compras

id_compras INT AUTO_INCREMENT Pk,

id_usuario INT FK

total DECIMAL(10,2) NOT NULL

fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


* Detalle Compra

id_detalle_compra INT AUTO_INCREMENT PK,

id_compras INT FK,

id_producto INT FK,

id_servicio FK,

id_suscripcion FK

cantidad INT NOT NULL,

subtotal DECIMAL(10,2) NOT NULL,

iva DECIMAL(10,2) NOT NULL,

descuento DECIMAL(10,2) NOT NULL,

* Pagos

id_pago INT AUTO_INCREMENT PK,

id_usuario INT FK,

id_compras INT FK,

fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

metodo_pago ENUM('tarjeta','efectivo','transferencia'),
estado ENUM('pendiente','confirmado','rechazado') 

* Suscripciones

id_suscripcion INT AUTO_INCREMENT PK,

id_usuario INT FK,

fecha_inicio DATE NOT NULL,

fecha_fin DATE NOT NULL,

estado ENUM('activa','vencida','cancelada')

* Reservas

id_reserva INT AUTO_INCREMENT PK,

id_usuario INT FK,

idprofesional INT FK,

id_servicio INT FK,

fecha_reserva DATE NOT NULL,

hora_reserva TIME NOT NULL,

estado ENUM('pendiente','confirmada','realizada','cancelada') 

* Progreso del Usuario

id_progreso INT AUTO_INCREMENT PK,

id_usuario INT FK,

fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

peso DECIMAL(5,2),

altura DECIMAL(5,2),

imc DECIMAL(5,2),


