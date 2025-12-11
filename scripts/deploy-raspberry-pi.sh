#!/bin/bash
# =============================================================================
# Raspberry Pi Deployment Script
# BlackRoad OS - Multi-platform infrastructure
# =============================================================================
# Supports: Raspberry Pi 3/4/5, Zero 2W
# OS: Raspberry Pi OS (64-bit recommended), Ubuntu Server

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Configuration
APP_NAME="blackroad-hello"
APP_DIR="/opt/${APP_NAME}"
DOCKER_COMPOSE_VERSION="2.24.0"

# =============================================================================
# Pre-flight Checks
# =============================================================================
preflight_checks() {
    log_info "Running pre-flight checks..."

    # Check if running as root
    if [[ $EUID -ne 0 ]]; then
        log_error "This script must be run as root (use sudo)"
        exit 1
    fi

    # Check architecture
    ARCH=$(uname -m)
    log_info "Architecture: $ARCH"

    if [[ "$ARCH" != "aarch64" && "$ARCH" != "armv7l" ]]; then
        log_warn "Non-ARM architecture detected. This script is optimized for Raspberry Pi."
    fi

    # Check memory
    TOTAL_MEM=$(free -m | awk '/^Mem:/{print $2}')
    log_info "Total Memory: ${TOTAL_MEM}MB"

    if [[ $TOTAL_MEM -lt 512 ]]; then
        log_warn "Low memory detected. Consider using a swap file."
    fi

    # Check disk space
    DISK_SPACE=$(df -h / | awk 'NR==2 {print $4}')
    log_info "Available Disk Space: $DISK_SPACE"
}

# =============================================================================
# System Setup
# =============================================================================
setup_system() {
    log_info "Updating system packages..."
    apt-get update && apt-get upgrade -y

    log_info "Installing required packages..."
    apt-get install -y \
        apt-transport-https \
        ca-certificates \
        curl \
        gnupg \
        lsb-release \
        git \
        nginx \
        ufw \
        fail2ban
}

# =============================================================================
# Docker Installation
# =============================================================================
install_docker() {
    if command -v docker &> /dev/null; then
        log_info "Docker already installed: $(docker --version)"
        return
    fi

    log_info "Installing Docker..."

    # Add Docker's official GPG key
    curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

    # Set up the repository
    echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian \
        $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

    # Enable and start Docker
    systemctl enable docker
    systemctl start docker

    # Add current user to docker group
    if [[ -n "${SUDO_USER:-}" ]]; then
        usermod -aG docker "$SUDO_USER"
        log_info "Added $SUDO_USER to docker group"
    fi

    log_success "Docker installed: $(docker --version)"
}

# =============================================================================
# Application Deployment
# =============================================================================
deploy_application() {
    log_info "Deploying application..."

    # Create application directory
    mkdir -p "$APP_DIR"
    cd "$APP_DIR"

    # Clone or pull repository
    if [[ -d ".git" ]]; then
        log_info "Updating existing repository..."
        git pull origin main
    else
        log_info "Cloning repository..."
        git clone https://github.com/BlackRoad-OS/blackroad-hello.git .
    fi

    # Create environment file if not exists
    if [[ ! -f ".env" ]]; then
        cat > .env << 'EOF'
NODE_ENV=production
POSTGRES_USER=blackroad
POSTGRES_PASSWORD=changeme_in_production
POSTGRES_DB=blackroad
EOF
        log_warn "Created .env file. Please update with secure values!"
    fi

    # Build and start containers
    log_info "Starting Docker containers..."
    docker compose up -d --build

    log_success "Application deployed!"
}

# =============================================================================
# Nginx Reverse Proxy
# =============================================================================
setup_nginx() {
    log_info "Configuring Nginx reverse proxy..."

    cat > /etc/nginx/sites-available/${APP_NAME} << 'EOF'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
EOF

    # Enable site
    ln -sf /etc/nginx/sites-available/${APP_NAME} /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default

    # Test and reload
    nginx -t && systemctl reload nginx

    log_success "Nginx configured!"
}

# =============================================================================
# Security Hardening
# =============================================================================
setup_security() {
    log_info "Setting up security..."

    # Configure UFW firewall
    ufw default deny incoming
    ufw default allow outgoing
    ufw allow ssh
    ufw allow http
    ufw allow https
    ufw --force enable

    # Configure fail2ban
    systemctl enable fail2ban
    systemctl start fail2ban

    log_success "Security configured!"
}

# =============================================================================
# Systemd Service
# =============================================================================
create_service() {
    log_info "Creating systemd service..."

    cat > /etc/systemd/system/${APP_NAME}.service << EOF
[Unit]
Description=BlackRoad OS Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=${APP_DIR}
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

    systemctl daemon-reload
    systemctl enable ${APP_NAME}

    log_success "Systemd service created!"
}

# =============================================================================
# Health Check
# =============================================================================
health_check() {
    log_info "Running health check..."

    sleep 5

    if curl -sf http://localhost:80 > /dev/null; then
        log_success "Application is running and healthy!"
    else
        log_error "Application health check failed"
        docker compose logs --tail=50
        exit 1
    fi
}

# =============================================================================
# Main
# =============================================================================
main() {
    echo ""
    echo "============================================="
    echo "   BlackRoad OS - Raspberry Pi Deployment"
    echo "============================================="
    echo ""

    preflight_checks
    setup_system
    install_docker
    deploy_application
    setup_nginx
    setup_security
    create_service
    health_check

    echo ""
    log_success "Deployment complete!"
    echo ""
    echo "Access your application at: http://$(hostname -I | awk '{print $1}')"
    echo ""
    echo "Useful commands:"
    echo "  - View logs: docker compose -f ${APP_DIR}/docker-compose.yml logs -f"
    echo "  - Restart:   systemctl restart ${APP_NAME}"
    echo "  - Status:    systemctl status ${APP_NAME}"
    echo ""
}

# Run main function
main "$@"
