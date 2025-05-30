# Docker Setup for HireOnAI Backend

This guide explains how to run the HireOnAI backend using Docker.

## Prerequisites

- Docker installed on your machine
- Docker Compose installed on your machine
- MongoDB server running (external to Docker)

## Running with Docker Compose

1. Copy the `.env.example` file to `.env` and fill in the required environment variables:

```bash
cp .env.example .env
```

2. Update the `MONGODB_URI` in your `.env` file to point to your existing MongoDB server.

3. Build and start the service:

```bash
docker-compose up -d
```

This will start the Node.js application which will connect to your existing MongoDB server.

4. The application will be available at http://localhost:3000 and the API documentation at http://localhost:3000/docs

## Running the Application Only (Using Dockerfile)

If you want to run just the application without Docker Compose:

1. Build the Docker image:

```bash
docker build -t hireonai-backend .
```

2. Run the container:

```bash
docker run -p 3000:3000 --env-file .env hireonai-backend
```

## Environment Variables

Make sure to set these environment variables in your `.env` file:

- `PORT`: The port on which the server will run (default: 3000)
- `NODE_ENV`: The environment (development, production)
- `MONGODB_URI`: MongoDB connection URI pointing to your existing MongoDB server
- `JWT_SECRET`: Secret key for JWT tokens
- `COOKIE_PASSWORD`: Password for cookie authentication
- And other variables as needed for authentication and cloud storage 