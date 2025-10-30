#!/bin/bash

# Build and Deploy Script for Demo App
set -e

echo "🔨 Building Docker images..."

# Build backend
echo "Building backend..."
cd backend
docker build -t user-api-backend:latest .
cd ..

# Build frontend
echo "Building frontend..."
cd frontend
docker build -t user-management-frontend:latest .
cd ..

# Build client service
echo "Building client service..."
cd client-service
docker build -t user-api-client:latest .
cd ..

echo "✅ All images built successfully!"

echo ""
echo "🚀 Deploying to Kubernetes..."

# Apply Kubernetes manifests
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/client-service-deployment.yaml
kubectl apply -f k8s/ingress.yaml

echo "✅ Deployment complete!"
echo ""
echo "📋 Service Status:"
kubectl get pods -n demo-app
echo ""
echo "🌐 Access the app:"
echo "  Frontend: kubectl port-forward -n demo-app svc/user-management-frontend-service 8080:80"
echo "  Backend:  kubectl port-forward -n demo-app svc/user-api-backend-service 3000:3000"
