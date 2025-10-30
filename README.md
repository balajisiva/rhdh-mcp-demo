# User Management Demo App

A simple demo application showcasing a microservices architecture with:
- **Backend API**: Node.js/Express REST API
- **Frontend**: React web application
- **Client Service**: Node.js service that periodically accesses the API

All services are containerized and ready for Kubernetes deployment.

## Architecture

```
┌─────────────────┐
│   Frontend      │ (React App on Port 80)
│   (Port 80)     │
└────────┬────────┘
         │
         │ HTTP
         │
┌────────▼────────┐
│   Backend API   │ (Express API on Port 3000)
│   (Port 3000)   │
└────────┬────────┘
         │
         │ HTTP
         │
┌────────▼────────┐
│  Client Service │ (Periodic API calls)
│   (Daemon)      │
└─────────────────┘
```

## Local Development

### Backend

```bash
cd backend
npm install
npm start
# Runs on http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000 (React default)
# Set REACT_APP_API_URL=http://localhost:3001 if backend is on different port
```

### Client Service

```bash
cd client-service
npm install
API_URL=http://localhost:3000 npm start
```

## Docker Build

Build all Docker images:

```bash
# Backend
cd backend
docker build -t user-api-backend:latest .

# Frontend
cd frontend
docker build -t user-management-frontend:latest .

# Client Service
cd client-service
docker build -t user-api-client:latest .
```

## Kubernetes Deployment

Deploy to your local Kubernetes cluster:

```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Deploy backend
kubectl apply -f k8s/backend-deployment.yaml

# Deploy frontend
kubectl apply -f k8s/frontend-deployment.yaml

# Deploy client service
kubectl apply -f k8s/client-service-deployment.yaml

# Deploy ingress (optional)
kubectl apply -f k8s/ingress.yaml
```

## Port Forwarding (if not using Ingress)

```bash
# Backend
kubectl port-forward -n demo-app svc/user-api-backend-service 3000:3000

# Frontend
kubectl port-forward -n demo-app svc/user-management-frontend-service 8080:80
```

Then access:
- Frontend: http://localhost:8080
- Backend API: http://localhost:3000

## Backstage Integration

The catalog-info.yaml files in each service directory register them with Backstage.

To register with Backstage (running on port 7007):

1. **Register the component group:**
   ```bash
   kubectl apply -f catalog-info.yaml
   ```

2. **Or add to Backstage catalog:**
   - Go to http://localhost:7007/catalog
   - Click "Register Existing Component"
   - Select "GitHub" or "GitLab" if using version control
   - Or use "URL" and point to the catalog-info.yaml files

## API Endpoints

### Backend API (http://localhost:3000)

- `GET /health` - Health check
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Client Service Behavior

The client service:
- Checks backend health every 5 cycles (50 seconds)
- Fetches users list periodically (every 10 seconds)
- Creates sample users every 3 cycles
- Logs all operations to stdout

## Environment Variables

### Backend
- `PORT` - Server port (default: 3000)

### Frontend
- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:3000)

### Client Service
- `API_URL` - Backend API URL (default: http://user-api-backend-service:3000)
- `INTERVAL` - Polling interval in milliseconds (default: 10000)

## License

MIT
