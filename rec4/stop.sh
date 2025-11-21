#!/bin/bash

# Stop script for REC4 Docker environments
# Usage: ./stop.sh [demo|beta|all] [--clean]

ENV=${1:-all}
CLEAN=${2}

stop_env() {
    local compose_file=$1
    local env_name=$2
    
    if [ "$CLEAN" == "--clean" ]; then
        echo "🧹 Stopping and cleaning $env_name environment (removing volumes)..."
        docker-compose -f $compose_file down -v
    else
        echo "🛑 Stopping $env_name environment..."
        docker-compose -f $compose_file down
    fi
}

case $ENV in
  demo)
    stop_env "docker-compose.demo.yml" "DEMO"
    ;;
  beta)
    stop_env "docker-compose.beta.yml" "BETA"
    ;;
  all)
    stop_env "docker-compose.demo.yml" "DEMO"
    stop_env "docker-compose.beta.yml" "BETA"
    ;;
  *)
    echo "Usage: ./stop.sh [demo|beta|all] [--clean]"
    echo ""
    echo "Examples:"
    echo "  ./stop.sh demo           # Stop demo environment"
    echo "  ./stop.sh beta           # Stop beta environment"
    echo "  ./stop.sh all            # Stop all environments"
    echo "  ./stop.sh demo --clean   # Stop demo and remove volumes"
    echo "  ./stop.sh all --clean    # Stop all and remove all volumes"
    exit 1
    ;;
esac

echo "✅ Done!"
