# ms-product-test

Microservicio de gestión de productos desarrollado con Java 17, Spring Boot y Gradle.

## Características

- CRUD de productos (crear, leer, actualizar, eliminar)
- Persistencia con JPA y SQL Server
- Validación de datos
- Pruebas unitarias y de integración
- Pruebas de rendimiento con JMeter

## Requisitos

- Java 17
- Gradle
- SQL Server (o H2 para pruebas)
- Docker (opcional, para despliegue y pruebas locales)

## Configuración

Configura la conexión a la base de datos en `src/main/resources/application.properties`: