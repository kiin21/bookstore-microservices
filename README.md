# Bookstore Microservices 📚

<p align="center">
 <a href="#tech">Technologies</a> • 
 <a href="#started">Getting Started</a> • 
 <a href="#routes">API Endpoints</a> •
 <a href="#architecture">Architecture</a> •
 <a href="#contribute">Contribute</a>
</p>

<p align="center">
    <b>A modern microservices-based bookstore application built with Spring Boot, Spring Cloud, and React. This project demonstrates enterprise-grade microservices architecture with event-driven communication, OAuth2 security, and containerized deployment.</b>
</p>

<h2 id="tech">💻 Technologies</h2>

**Backend:**

- Java 21
- Spring Boot 3.x
- Spring Cloud Gateway
- Spring Security (OAuth2)
- Spring Data JPA
- RabbitMQ
- PostgreSQL
- Keycloak
- Docker & Docker Compose
- Maven

**Frontend:**

- React 19
- TypeScript
- Vite
- Bootstrap

**Infrastructure:**

- Docker
- Nginx
- Testcontainers

<h2 id="started">🚀 Getting Started</h2>

This project uses Docker Compose for easy setup and deployment of all microservices.

<h3>Prerequisites</h3>

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- [Java 21+](https://adoptium.net/) (for local development)
- [Node.js 18+](https://nodejs.org/) (for frontend development)
- [Taskfile](https://taskfile.dev/installation/) (recommended)

<h3>Clone</h3>

```bash
git clone https://github.com/kiin21/bookstore-microservices.git
cd bookstore-microservices
```

<h3>Starting the Application</h3>

**Option 1: Using Taskfile (Recommended)**

```bash
task start
```

**Option 2: Using Docker Compose directly**

```bash
cd deployment/docker-compose
# Start infrastructure services (databases, message broker, etc.)
docker compose -f infra.yml up -d
# Wait for all services to start, then start application services
docker compose -f apps.yml up -d
```

<h3>Accessing the Application</h3>

- **Web Application**: [http://localhost](http://localhost)
- **API Gateway**: [http://localhost:8989](http://localhost:8989)
- **Swagger UI**: [http://localhost:8989/swagger-ui.html](http://localhost:8989/swagger-ui.html)
- **Keycloak Admin**: [http://localhost:9191](http://localhost:9191) (admin/admin)

<h2 id="routes">📍 API Endpoints</h2>

<h3>Catalog Service</h3>

| Route                                       | Description                                                 |
| ------------------------------------------- | ----------------------------------------------------------- |
| <kbd>GET /api/catalog/products</kbd>        | Get paginated list of products [see details](#get-products) |
| <kbd>GET /api/catalog/products/{code}</kbd> | Get product by code [see details](#get-product-by-code)     |

<h3>Order Service</h3>

| Route                                    | Description                                         |
| ---------------------------------------- | --------------------------------------------------- |
| <kbd>POST /api/orders</kbd>              | Create a new order [see details](#post-order)       |
| <kbd>GET /api/orders</kbd>               | Get user's orders [see details](#get-orders)        |
| <kbd>GET /api/orders/{orderNumber}</kbd> | Get order details [see details](#get-order-details) |

<h3 id="get-products">GET /api/catalog/products</h3>

**QUERY PARAMETERS**

```
page: 1 (default) (base 1 index)
size: 10 (default)
```

**RESPONSE**

```json
{
  "data": [
    {
      "code": "P100",
      "name": "The Hunger Games",
      "description": "Winning will make you famous. Losing means certain death...",
      "imageUrl": "https://images.manning.com/book_1.jpg",
      "price": 34.0
    }
  ],
  "totalElements": 15,
  "pageNumber": 1,
  "totalPages": 2,
  "isFirst": true,
  "isLast": false,
  "hasNext": true,
  "hasPrevious": false
}
```

<h3 id="get-product-by-code">GET /api/catalog/products/{code}</h3>

**RESPONSE**

```json
{
  "code": "P100",
  "name": "The Hunger Games",
  "description": "Winning will make you famous. Losing means certain death...",
  "imageUrl": "https://images.manning.com/book_1.jpg",
  "price": 34.0
}
```

<h3 id="post-order">POST /api/orders</h3>

**REQUEST**

```json
{
  "items": [
    {
      "code": "P100",
      "name": "The Hunger Games",
      "price": 34.0,
      "quantity": 2
    }
  ],
  "customer": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "123-456-7890"
  },
  "deliveryAddress": {
    "addressLine1": "123 Main St",
    "addressLine2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}
```

**RESPONSE**

```json
{
  "orderNumber": "order-12345"
}
```

<h3 id="get-orders">GET /api/orders</h3>

**RESPONSE**

```json
[
  {
    "orderNumber": "order-12345",
    "status": "NEW",
    "userName": "john.doe",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

<h3 id="get-order-details">GET /api/orders/{orderNumber}</h3>

**RESPONSE**

```json
{
  "orderNumber": "order-12345",
  "userName": "john.doe",
  "status": "NEW",
  "items": [
    {
      "code": "P100",
      "name": "The Hunger Games",
      "price": 34.0,
      "quantity": 2
    }
  ],
  "customer": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "123-456-7890"
  },
  "deliveryAddress": {
    "addressLine1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "createdAt": "2024-01-15T10:30:00Z"
}
```

<h2 id="architecture">🏗️ Architecture</h2>

<h3>Core Components</h3>

- **Catalog Service**: Manages the product catalog
- **Order Service**: Handles customer orders
- **Notification Service**: Sends notifications to customers about order events
- **API Gateway**: Acts as a single entry point for all client requests
- **Web UI**: Provides a user interface for interacting with the services

---

## Catalog Service

**Domain Layer**

- `ProductEntity`: Core entity representing a product.
- `ProductRepository`: Data access layer for product operations.
- `ProductService`: Business logic implementation.
- `ProductNotFoundException`: Custom exception for product-related errors.

**Web Layer**

- REST Controllers for handling HTTP requests.
- Global exception handling.
- Request/Response DTOs.
- Input validation.

**Configuration**

- Application properties.
- Database configuration.
- Security settings.
- Monitoring configuration.

---

## Order Service

**Domain Layer**

- `OrderEntity`: Core entity representing a customer order.
- `OrderItemEntity`: Represents individual items within an order.
- `OrderEventEntity`: Tracks order state changes and events.
- `OrderRepository`: Data access layer for order operations.
- `OrderService`: Business logic for order management.
- `OrderEventService`: Handles order event processing and state transitions.
- `OrderValidator`: Validates order data and business rules.
- `SecurityService`: Handles security-related operations.
- Custom exceptions:
  - `OrderNotFoundException`: When an order cannot be found.
  - `InvalidOrderException`: When order validation fails.

**Event-Driven Architecture**

- `OrderEventPublisher`: Publishes order events to other services (notification service).
- `OrderEventMapper`: Maps between domain events and event entities.

**Web Layer**

- REST Controllers for order operations.
- Global exception handling.
- Request/Response DTOs.
- Input validation.

**Integration**

- Communicates with Catalog Service for product information.
- Integrates with Notification Service for order status updates.

**Features**

- Order creation and management.
- Order status tracking.
- Order validation.
- Event-driven architecture.
- Integration with other microservices.
- Security and authentication.

---

## Notification Service

The Notification Service is responsible for sending notifications to customers about order events such as creation, delivery, cancellation, and errors. It listens to order event messages from RabbitMQ and sends email notifications accordingly.

**Domain Layer**

- `OrderCreatedEvent`, `OrderDeliveredEvent`, `OrderCancelledEvent`, `OrderErrorEvent`: Event models representing different order states.
- `Customer`, `Address`, `OrderItem`: Value objects used in event payloads.
- `OrderEventEntity`: Entity for tracking processed events and preventing duplicate notifications.

**Event Handling**

- `OrderEventHandler`: Listens to RabbitMQ queues for order events and triggers notification logic.
- Uses `@RabbitListener` to consume messages from queues configured in `ApplicationProperties`.

**Logic**

- `NotificationService`: Handles the creation and sending of email notifications for each event type.
- Uses Spring's `JavaMailSender` for sending emails.
- Email content is customized for each event and sent to the customer or support email.

**Configuration**

- Application properties are loaded via `ApplicationProperties` using `@ConfigurationProperties(prefix = "notifications")`.
- RabbitMQ queues and exchange names are configurable.

**Features**

- Sends email notifications for order created, delivered, cancelled, and error events.
- Prevents duplicate notifications by tracking processed event IDs (using `OrderEventEntity` and repository checks).
- Integrates with RabbitMQ for event-driven communication.
- Uses validation annotations for event payloads.

**Example Event Flow**

1. Order Service publishes an event (e.g., order created) to RabbitMQ.
2. Notification Service receives the event from the queue.
3. `NotificationService` composes and sends an email to the customer.
4. The event is marked as processed to avoid duplicate notifications.

---

## API Gateway

The **API Gateway** is built using Spring Cloud Gateway

**Key Features**

- **Routing**: Forwards incoming HTTP requests to the appropriate backend services (Catalog, Order, Notification, etc.) based on route definitions.
- **Swagger UI Aggregation**: OpenAPI documentation from all backend services page at [http://localhost:8989/swagger-ui.html](http://localhost:8989/swagger-ui.html).

**Configuration**

- Routes and filters are defined in `api-gateway/src/main/resources/application.yml`.
- Swagger aggregation is implemented in [`SwaggerConfig.java`](api-gateway/src/main/java/com/kiin/bookstore/gateway/SwaggerConfig.java).

---

## Web app (Web UI)

**Features**

- Product catalog browsing with pagination.
- Add products to cart and manage cart items (update quantity, remove items).
- Place orders with customer and delivery information.
- View order details and order history.
- Secure login/logout using OAuth2 (Keycloak).
- Design using Bootstrap and Alpine.js.

**Architecture**

- Uses Thymeleaf for server-side rendering of HTML templates.
- Communicates with backend services (Catalog, Order) via the API Gateway.
- Secured with Spring Security and OAuth2 client.
- Cart state is managed on the client side using localStorage and JavaScript.

**Key Components**

- `ProductController`: Handles product listing and product API endpoints.
- `OrderController`: Handles cart, order creation, and order history.
- `ClientsConfig`: Configures HTTP clients for backend service communication.
- `SecurityConfig`: Configures security, OAuth2 login, and access rules.

**Configuration**

- API Gateway URL and other properties are managed via `application.properties` and injected using `@ConfigurationProperties`.
- OAuth2 client settings are configured for secure authentication.

**Work flow**

1. Browse products and add them to their cart.
2. Cart data is stored in the browser (localStorage) and managed with JavaScript.
3. Place an order, sends customer and delivery info of the order to the Order Service via the API Gateway.
4. Order Service processes the order, store order to order-db and sends notifications to Notification Service via RabbitMQ.

---

**Development**

- The gateway can be started with the rest of the system using Docker Compose.
- To run tests:
  ```bash
  ./mvnw test
  ```

---

## RabbitMQ config:

- RabbitMQ is used for event-driven communication between services.
  ![Alt text](docs/images/rabbitmq.png)

---

---

## Development

**Code Style**

The project uses Spotless Maven plugin for code formatting. To format your code:

```bash
./mvnw spotless:apply
```

**How to export realm configuration from Keycloak**

```bash
docker exec <container_id_or_name> \
  /opt/keycloak/bin/kc.sh export \
  --dir=/opt/keycloak/data/import \
  --realm=<your-realm-name> \
  --users=realm_file

docker cp <container_id_or_name>:/opt/keycloak/data/import ./
```

<h2 id="contribute">📫 Contribute</h2>

Contributions are welcome! Please follow these steps to contribute to this project:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Follow the commit patterns
4. Make your changes and ensure all tests pass
5. Run code formatting: `./mvnw spotless:apply`
6. Open a Pull Request explaining the problem solved or feature made

<h3>Development Guidelines</h3>

- Follow the existing code style and patterns
- Write tests for new features
- Update documentation as needed
- Use conventional commit messages
- Ensure all tests pass before submitting PR

<h3>Documentations that might help</h3>

[📝 How to create a Pull Request](https://www.atlassian.com/br/git/tutorials/making-a-pull-request)

[💾 Commit pattern](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716)

[🚀 Spring Boot Documentation](https://spring.io/projects/spring-boot)

[☁️ Spring Cloud Gateway](https://spring.io/projects/spring-cloud-gateway)
