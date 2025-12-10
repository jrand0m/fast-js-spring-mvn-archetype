# Multi-stage Dockerfile for Spring Boot + Next.js

# Stage 1: Build
FROM eclipse-temurin:21-jdk as build

WORKDIR /app

# Copy Maven wrapper and pom.xml
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Download dependencies (cached layer)
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src ./src
COPY frontend ./frontend

# Build application (includes Next.js build)
RUN ./mvnw clean package -DskipTests -B

# Stage 2: Runtime
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose application port
EXPOSE 3003

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3003/actuator/health || exit 1

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]
