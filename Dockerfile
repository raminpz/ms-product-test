FROM openjdk:17-jdk-slim
WORKDIR /app

# Instalar netcat para que wait-for-it.sh funcione
RUN apt-get update && apt-get install -y netcat && rm -rf /var/lib/apt/lists/*

# Copiar el archivo JAR y el script wait-for-it.sh
COPY build/libs/ms-produc-test-0.0.1-SNAPSHOT.jar ms-product-test.jar
COPY wait-for-it.sh wait-for-it.sh
RUN chmod +x wait-for-it.sh

EXPOSE 8080

# Ejecutar wait-for-it.sh para esperar a SQL Server y luego arrancar la app
ENTRYPOINT ["./wait-for-it.sh", "sqlserver", "1433", "--", "java", "-jar", "ms-product-test.jar"]
