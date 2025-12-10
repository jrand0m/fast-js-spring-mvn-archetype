# Spring Boot + Next.js Maven Archetype

A Maven archetype for generating full-stack applications with Spring Boot backend and Next.js frontend.

## Features

- **Backend**: Spring Boot 3.2.0 with Java 21
  - REST API with full CRUD operations
  - JPA/Hibernate with H2 database
  - CORS configuration for development
  - Service layer and repository pattern
  - JUnit/MockMvc tests

- **Frontend**: Next.js 14 with React 18 and TypeScript
  - Static export configuration
  - Tailwind CSS styling
  - Complete CRUD UI components
  - TypeScript API client
  - Jest + React Testing Library tests

- **Build System**: Maven orchestrates both Java and Node.js
  - Custom Maven goals: `mvn dev:run`, `mvn test:fe`, `mvn test:be`
  - Single JAR deployment with embedded frontend
  - Docker image creation with Jib

## Quick Start

### Generate a New Project

```bash
mvn archetype:generate \
  -DarchetypeGroupId=me.nd0.jra \
  -DarchetypeArtifactId=springboot-nextjs-archetype \
  -DarchetypeVersion=1.0.0 \
  -DgroupId=com.example \
  -DartifactId=my-app \
  -Dpackage=com.example.myapp
```

### Build and Run

```bash
cd my-app

# Install dependencies and build
mvn clean install

# Run development servers (backend on :3003, frontend on :3001)
mvn dev:run

# Build production JAR
mvn package

# Run production JAR
java -jar target/my-app-1.0.0-SNAPSHOT.jar
```

## Project Structure

Generated projects have this structure:

```
my-app/
├── pom.xml                          # Main build configuration
├── src/main/java/                   # Spring Boot backend
│   ├── Application.java
│   ├── model/Item.java
│   ├── repository/ItemRepository.java
│   ├── service/ItemService.java
│   ├── controller/ItemController.java
│   └── config/CorsConfig.java
├── src/main/resources/
│   ├── application.properties
│   ├── application-dev.properties
│   └── data.sql
├── src/test/java/                   # Backend tests
│   └── controller/ItemControllerTest.java
└── frontend/                        # Next.js frontend
    ├── package.json
    ├── next.config.js
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx
    │   │   ├── page.tsx
    │   │   └── globals.css
    │   ├── components/
    │   │   ├── ItemList.tsx
    │   │   └── __tests__/ItemList.test.tsx
    │   └── api/
    │       └── items.ts
    └── (config files)
```

## Maven Goals

- `mvn clean install` - Build everything
- `mvn dev:run` - Start both servers for development
- `mvn test:fe` - Run frontend tests only
- `mvn test:be` - Run backend tests only
- `mvn package` - Build production JAR with embedded frontend
- `mvn deploy` - Build and push Docker image to localhost:5000

## Development

Backend runs on http://localhost:3003
Frontend runs on http://localhost:3001

The frontend proxies API requests to the backend during development.

## Production Deployment

The production build creates a single JAR file with the Next.js static export embedded. Run it with:

```bash
java -jar target/my-app-1.0.0-SNAPSHOT.jar
```

Everything is served from http://localhost:3003

## Requirements

- Java 21+
- Maven 3.6+
- Node.js and npm are downloaded automatically by Maven

## License

MIT License
