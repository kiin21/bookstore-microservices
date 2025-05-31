This is my very first project in microservices using Spring framework. It is a simple application that demonstrates the use of Spring Boot, Spring Cloud, and Docker to create a microservices architecture.

Core components of the project include:

- **Catalog Service**: Manages the product catalog.
- **Order Service**: Handles customer orders.
- **Notification Service**: Sends notifications to customers.
- **API Gateway**: Acts as a single entry point for all client requests.
- **Web UI**: Provides a user interface for interacting with the services.

# Getting Started

Swagger pages are available at: [http://localhost:8989/swagger-ui.html](http://localhost:8989/swagger-ui.html)

## Catalog Service:
### Domain Layer
- `ProductEntity`: Core entity representing a product
- `ProductRepository`: Data access layer for product operations
- `ProductService`: Business logic implementation
- `ProductNotFoundException`: Custom exception for product-related errors

### Web Layer
- REST Controllers for handling HTTP requests
- Global exception handling
- Request/Response DTOs
- Input validation

### Configuration
- Application properties
- Database configuration
- Security settings
- Monitoring configuration

## Order Service:
### Domain Layer
- `OrderEntity`: Core entity representing a customer order
- `OrderItemEntity`: Represents individual items within an order
- `OrderEventEntity`: Tracks order state changes and events
- `OrderRepository`: Data access layer for order operations
- `OrderService`: Business logic implementation for order management
- `OrderEventService`: Handles order event processing and state transitions
- `OrderValidator`: Validates order data and business rules
- `SecurityService`: Handles security-related operations
- Custom exceptions:
  - `OrderNotFoundException`: When an order cannot be found
  - `InvalidOrderException`: When order validation fails

### Event-Driven Architecture
- `OrderEventPublisher`: Publishes order events to other services
- `OrderEventMapper`: Maps between domain events and event entities
- Event types:
  - Order created
  - Order status changes
  - Order validation events

### Web Layer
- REST Controllers for order operations
- Global exception handling
- Request/Response DTOs
- Input validation

### Integration
- Communicates with Catalog Service for product information
- Integrates with Notification Service for order status updates
- Uses event-driven communication for service decoupling

### Features
- Order creation and management
- Order status tracking
- Order validation
- Event-driven architecture
- Integration with other microservices
- Security and authentication

**API Gateway**:
A spring cloud gateway that routes requests to the appropriate services.

## Monitoring and Observability

The service includes several monitoring and observability features:

- Actuator endpoints at `/actuator`
- Prometheus metrics at `/actuator/prometheus`
- Distributed tracing with OpenTelemetry and Zipkin

## Development

### Code Style

The project uses Spotless Maven plugin for code formatting. To format your code:
```bash
./mvnw spotless:apply
```

### Testing

Run the tests:
```bash
./mvnw test
```

## Configuration

Key configuration properties can be found in `application.yml`. The service supports:
- Database configuration
- Server port
- Actuator endpoints
- OpenAPI documentation
- Tracing configuration