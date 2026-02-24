# BamboChat - Real-time Messaging Backend

BamboChat is a high-performance backend API and WebSocket server for real-time messaging, featuring robust authentication and friend management.

---

## Core Features

*   **Real-time Messaging**: Bi-directional communication powered by **Socket.io**.
*   **Multi-mode Auth**: Secure login via **Email OTP (Brevo)** or **Google OAuth2**.
*   **Media Support**: Avatar management and image storage via **Cloudinary**.
*   **Friendship System**: Search, request, and manage contacts.
*   **Group Conversations**: Support for persistent chat rooms with roles (Admin/Member).
*   **Scalable Architecture**: Layered design (Controllers-Services-Repositories) for maintainability.

---

## Tech Stack

*   **Node.js & Express**: API framework.
*   **MongoDB & Mongoose**: Data persistence.
*   **Passport.js**: Authentication engine.
*   **Socket.io**: Real-time layer.
*   **Cloudinary & Multer**: Media processing.
*   **Brevo SDK**: SMTP utility.
*   **Docker & Docker Compose**: Containerization and orchestration.

---

## Directory Structure

```text
.
├── src/
│   ├── config/         # App, Database, and Passport configurations
│   ├── controllers/    # API request handlers
│   ├── middlewares/    # Custom filters (Auth, Error)
│   ├── models/         # Mongoose Schemas
│   ├── repositories/   # Data access layer
│   ├── routes/         # Endpoint definitions
│   ├── services/       # Business logic
│   ├── sockets/        # Real-time event logic
│   ├── utils/          # Utilities (Mailer, Cloudinary)
│   └── server.js       # Application entry point
├── doc/                # Technical documentation
└── .env                # Environment variables
```

---

---

## CI/CD Pipeline

The project uses **GitHub Actions** for automated Deployment to **Azure App Service**:

1.  **Authentication**: Uses **OpenID Connect (OIDC)** for secure, secret-less login to Azure.
2.  **Build**: Docker images are built locally on the GitHub runner.
3.  **Registry**: Images are pushed to **Azure Container Registry (ACR)**.
4.  **Deployment**: Uses **Azure CLI** to update the Web App's container image and registry credentials automatically.

---

## Technical Documentation

Detailed guides are available in the `doc/` directory:

1.  [**Setup Guide**](doc/setup_guide.md) - Local environment configuration.
2.  [**API Architecture**](doc/api_architecture.md) - Endpoint definitions and design patterns.
3.  [**Database Design**](doc/database_design.md) - Mongoose schemas and structures.
4.  [**Authentication**](doc/authentication.md) - Email OTP and Google OAuth flows.
5.  [**WebSocket Flow**](doc/websocket_flow.md) - Real-time messaging logic.
6.  [**Azure Deployment & CI/CD**](doc/azure_deployment.md) - Step-by-step production setup and automation.

---

## License

This project is developed for educational and personal use.
