# Usa una imagen base de OpenJDK para ejecutar el proyecto
FROM openjdk:17-jdk-slim

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el archivo JAR desde el directorio target del proyecto a la imagen Docker
COPY build/libs/ms-produc-test-0.0.1-SNAPSHOT.jar ms-product-test.jar

# Expón el puerto 8080 en el contenedor
EXPOSE 8080

# Define el comando para ejecutar el archivo JAR
ENTRYPOINT ["java", "-jar", "ms-product-test.jar"]
