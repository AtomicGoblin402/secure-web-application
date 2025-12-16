# Secure Web Application

A modern, secure web application template featuring a robust Node.js backend and a dynamic Angular frontend. This project implements industry-standard security practices including JWT authentication, Role-Based Access Control (RBAC), and secure password hashing.

## Features

-   **Secure Authentication**: User registration and login using `bcryptjs` for password hashing and `jsonwebtoken` (JWT) for session management.
-   **Role-Based Access Control (RBAC)**: Protect routes and API endpoints based on user roles (e.g., 'user', 'admin').
-   **User Profile Management**: Functionality to securely update user details (Name, Email) and Password.
-   **Modern UI**: Responsive "Glassmorphism" design using Vanilla CSS and Google Fonts (Inter).
-   **Interactive Registration**: Real-time password strength validation and visibility toggles.
-   **Personalized Dashboard**: Dynamic home screen displaying user information.
-   **Containerized**: Fully Dockerized environment (Frontend, Backend, PostgreSQL) orchestrated with Docker Compose.

## Technology Stack

-   **Frontend**: Angular, CSS3 (Glassmorphism), TypeScript.
-   **Backend**: Node.js, Express.js, Sequelize ORM.
-   **Database**: PostgreSQL.
-   **DevOps**: Docker, Docker Compose, Nginx.

## Prerequisites

-   [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running.
-   (Optional) Node.js and npm for local development.

## Getting Started

### Quick Start (Docker)

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd secure-web-application
    ```

2.  **Build and Run**:
    Run the application using Docker Compose. This will build the images and start the services (Frontend, Backend, Database).
    ```bash
    docker-compose up --build
    ```

3.  **Access the Application**:
    -   **Frontend**: Open [http://localhost:4200](http://localhost:4200) in your browser.
    -   **Backend API**: Running at [http://localhost:3000](http://localhost:3000).

### Local Development (Without Docker)

If you prefer to run services locally:

1.  **Database**: Ensure you have a PostgreSQL instance running and update the `.env` file in `backend/` with your credentials.
2.  **Backend**:
    ```bash
    cd backend
    npm install
    npm start
    ```
3.  **Frontend**:
    ```bash
    cd frontend
    npm install
    ng serve
    ```

## Project Structure

```
secure-web-application/
├── backend/                # Node.js/Express API
│   ├── models.js           # Sequelize Models (User)
│   ├── server.js           # Entry point & API Routes
│   └── Dockerfile          # Backend container config
├── frontend/               # Angular Web App
│   ├── src/app/
│   │   ├── auth/           # Login/Register components
│   │   ├── home/           # Dashboard component
│   │   ├── profile/        # Profile management
│   │   └── ...
│   └── Dockerfile          # Frontend container config (Nginx)
├── docker-compose.yml      # Container orchestration
└── README.md               # Project documentation
```

## Security Notes

-   **JWT Secret**: In production, ensure `JWT_SECRET` is a strong, random string set in the environment variables.
-   **Database Passwords**: Do not commit actual passwords to version control. Use `.env` files (excluded by `.gitignore`).

## License

This project is open source and available under the [MIT License](LICENSE).
