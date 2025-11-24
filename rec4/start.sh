#!/bin/bash

# Quick start script for REC4 Docker environments
# Usage: ./start.sh [demo|beta]

ENV=${1:-demo}

case $ENV in
  demo)
    echo "🚀 Starting DEMO environment..."
    echo "📚 Web interface will be available at: http://localhost:3000"
    docker-compose -f docker-compose.demo.yml up --build
    ;;
  beta)
    echo "🚀 Starting BETA environment..."
    echo "📚 Web interface will be available at: http://localhost:3001"
    docker-compose -f docker-compose.beta.yml up --build
    ;;
  *)
    echo "Usage: ./start.sh [demo|beta]"
    echo ""
    echo "Examples:"
    echo "  ./start.sh demo    # Start demo environment (port 3000)"
    echo "  ./start.sh beta    # Start beta environment (port 3001)"
    exit 1
    ;;
esac
