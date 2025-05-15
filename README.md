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

```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=products
spring.datasource.username=sa
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

## Ejecución local
- Clona el repositorio.
- Configura la base de datos.
- Ejecuta la aplicación:
- La API estará disponible en http://localhost:8080/api/products.