# ${artifactId}

Full-stack application with Spring Boot backend and Next.js frontend.

## Overview

This project provides a complete full-stack application with:

- **Backend**: Spring Boot 3.2 + H2 in-memory database
- **Frontend**: Next.js 14 + Tailwind CSS + TypeScript
- **Example**: CRUD operations with Item model
- **Build**: Unified Maven build system
- **Docker**: Production-ready containerization

## Prerequisites

- **Java**: JDK 21 or higher
- **Maven**: 3.9.0 or higher
- **Node.js**: 20.x or higher (automatically installed by Maven)
- **Docker**: For containerization (optional)

## Quick Start

### 1. Install Dependencies

```bash
mvn clean install
```

This command:
- Downloads and installs Node.js and npm (if not present)
- Installs Java dependencies
- Installs npm dependencies
- Builds the Next.js frontend
- Packages everything into a Spring Boot JAR

### 2. Run Development Server

```bash
mvn dev:run
```

This starts:
- Next.js development server on port 3001 (with hot module replacement)
- Spring Boot application on port 3003 (serving API)

Access the application at http://localhost:3003

The UI automatically proxies API calls to the Spring Boot backend.

### 3. Access Development Tools

While running in development mode:

- **Application**: http://localhost:3003
- **H2 Console**: http://localhost:3003/h2-console
  - JDBC URL: `jdbc:h2:mem:testdb`
  - Username: `sa`
  - Password: (leave blank)

## Maven Commands

### Build & Install

```bash
# Clean all build artifacts
mvn clean

# Full build (Java + npm dependencies + Next.js)
mvn install

# Package as executable JAR + Docker image
mvn package
```

### Development

```bash
# Start development servers (hot-reload enabled)
mvn dev:run
```

### Testing

```bash
# Run all tests (frontend + backend)
mvn test

# Run only frontend tests (Jest)
mvn test:fe

# Run only backend tests (JUnit)
mvn test:be
```

### Docker

```bash
# Build and deploy Docker image
mvn deploy
```

This creates a Docker image and pushes it to `localhost:5000/${artifactId}:${version}`.

**Note**: Requires a local Docker registry running on port 5000. To start one:

```bash
docker run -d -p 5000:5000 --name registry registry:2
```

## Project Structure

```
${artifactId}/
├── pom.xml                          # Maven build configuration
├── README.md                        # This file
├── Dockerfile                       # Multi-stage Docker build
├── .dockerignore                    # Docker build context filters
├── .gitignore                       # Git ignore rules
│
├── src/
│   ├── main/
│   │   ├── java/${package}/        # Spring Boot application
│   │   │   ├── Application.java    # Main entry point
│   │   │   ├── model/
│   │   │   │   └── Item.java       # JPA Entity
│   │   │   ├── repository/
│   │   │   │   └── ItemRepository.java  # Spring Data JPA
│   │   │   ├── controller/
│   │   │   │   └── ItemController.java  # REST endpoints
│   │   │   └── config/
│   │   │       ├── CorsConfig.java      # CORS for dev mode
│   │   │       └── H2Config.java        # H2 console config
│   │   └── resources/
│   │       ├── application.properties       # Main config
│   │       ├── application-dev.properties   # Dev profile
│   │       └── data.sql                     # Sample data
│   │
│   └── test/
│       └── java/${package}/        # JUnit tests
│           ├── ApplicationTests.java
│           └── ItemControllerTests.java
│
└── frontend/
    ├── package.json                # npm dependencies
    ├── next.config.js              # Next.js configuration
    ├── tailwind.config.js          # Tailwind CSS setup
    ├── postcss.config.js           # PostCSS configuration
    ├── tsconfig.json               # TypeScript configuration
    ├── jest.config.js              # Jest testing setup
    ├── .eslintrc.json              # ESLint rules
    │
    ├── src/
    │   ├── app/                    # Next.js App Router
    │   │   ├── layout.tsx          # Root layout
    │   │   ├── page.tsx            # Home page
    │   │   └── globals.css         # Global styles
    │   │
    │   ├── components/             # React components
    │   │   ├── ItemList.tsx        # List all items
    │   │   ├── ItemForm.tsx        # Create/Edit form
    │   │   └── ItemCard.tsx        # Single item display
    │   │
    │   └── lib/                    # Utilities
    │       ├── api.ts              # API client
    │       └── types.ts            # TypeScript interfaces
    │
    └── __tests__/                  # Jest tests
        └── ItemList.test.tsx
```

## Technology Stack

### Backend

- **Spring Boot** 3.2.x - Application framework
- **Spring Data JPA** - Database access
- **H2 Database** - In-memory database (development)
- **Lombok** - Reduce boilerplate code
- **JUnit 5** - Testing framework

### Frontend

- **Next.js** 14.x - React framework
- **React** 18.x - UI library
- **TypeScript** 5.x - Type safety
- **Tailwind CSS** 3.x - Utility-first CSS
- **Jest** - Testing framework
- **Testing Library** - React component testing

### Build Tools

- **Maven** 3.9+ - Build automation
- **frontend-maven-plugin** - Orchestrates npm from Maven
- **spring-boot-maven-plugin** - Spring Boot packaging
- **jib-maven-plugin** - Docker image creation

## Development Workflow

### 1. Start Development Servers

```bash
mvn dev:run
```

### 2. Make Changes

**Frontend changes** (hot-reload automatically):
- Edit files in `frontend/src/`
- Browser refreshes automatically
- Changes visible immediately

**Backend changes** (restart required):
- Edit files in `src/main/java/`
- Stop development server (Ctrl+C)
- Restart with `mvn dev:run`

### 3. Test Changes

```bash
# Test frontend
mvn test:fe

# Test backend
mvn test:be

# Test everything
mvn test
```

### 4. Build for Production

```bash
mvn clean install
```

This creates `target/${artifactId}-${version}.jar` with embedded Next.js static files.

## API Endpoints

All API endpoints are available under `/api/*`:

### Items CRUD

```
GET    /api/items          # List all items
GET    /api/items/{id}     # Get single item
POST   /api/items          # Create item
PUT    /api/items/{id}     # Update item
DELETE /api/items/{id}     # Delete item
```

### Example Request

```bash
# Get all items
curl http://localhost:3003/api/items

# Create item
curl -X POST http://localhost:3003/api/items \
  -H "Content-Type: application/json" \
  -d '{"name":"New Item","description":"Test item"}'
```

## Running in Production

### Option 1: Executable JAR

```bash
# Build
mvn clean install

# Run
java -jar target/${artifactId}-${version}.jar
```

Access at http://localhost:3003

### Option 2: Docker Container

```bash
# Build image
mvn package

# Run container
docker run -p 3003:3003 localhost:5000/${artifactId}:${version}
```

Access at http://localhost:3003

## Configuration

### Application Properties

Main configuration in `src/main/resources/application.properties`:

```properties
# Server
server.port=3003

# Database (H2 in-memory)
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect

# JPA
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=false
```

### Development Profile

Development-specific settings in `src/main/resources/application-dev.properties`:

```properties
# Enable H2 console
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# Show SQL queries
spring.jpa.show-sql=true

# CORS (allow Next.js dev server)
cors.allowed-origins=http://localhost:3001
```

Activate with: `mvn dev:run` (automatically uses dev profile)

### Environment Variables

Override configuration with environment variables:

```bash
# Change port
SERVER_PORT=8080 java -jar target/${artifactId}-${version}.jar

# Use different database
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/mydb java -jar target/*.jar
```

## Customization

### Adding New Entities

1. Create entity in `src/main/java/${package}/model/`
2. Create repository in `src/main/java/${package}/repository/`
3. Create controller in `src/main/java/${package}/controller/`
4. Add frontend components in `frontend/src/components/`
5. Update API client in `frontend/src/lib/api.ts`

### Changing Database

To use PostgreSQL instead of H2:

1. Add dependency to `pom.xml`:
   ```xml
   <dependency>
       <groupId>org.postgresql</groupId>
       <artifactId>postgresql</artifactId>
   </dependency>
   ```

2. Update `application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/mydb
   spring.datasource.username=user
   spring.datasource.password=password
   spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
   ```

### Styling with Tailwind

Tailwind CSS is configured in `frontend/tailwind.config.js`.

Add custom colors:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#your-color',
          secondary: '#your-color',
        },
      },
    },
  },
}
```

## Troubleshooting

### Port Already in Use

If port 3003 is in use:

```properties
# In application.properties
server.port=8080
```

```javascript
// In frontend/src/lib/api.ts
const baseUrl = '/api';  // Uses same domain/port
```

### Frontend Build Fails

```bash
# Clear npm cache
cd frontend
rm -rf node_modules package-lock.json
cd ..
mvn clean install
```

### Database Connection Issues

Check H2 console: http://localhost:3003/h2-console

Verify JDBC URL matches `application.properties`.

### Docker Build Fails

Ensure Docker daemon is running:
```bash
docker ps
```

For Windows/Mac, start Docker Desktop.

## Testing

### Backend Tests

Located in `src/test/java/${package}/`:

```bash
# Run all Java tests
mvn test:be

# Run specific test
mvn test -Dtest=ItemControllerTests
```

### Frontend Tests

Located in `frontend/__tests__/`:

```bash
# Run all Jest tests
mvn test:fe

# Or use npm directly
cd frontend
npm test
```

## License

[Add your license here]

## Contributing

[Add contribution guidelines here]

## Support

For issues and questions:
- Check this README first
- Review the example CRUD implementation
- Examine generated code and configuration

---

Generated with [Spring Boot + Next.js Maven Archetype](https://github.com/nd0/springboot-nextjs-archetype)
