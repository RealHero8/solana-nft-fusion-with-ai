#!/bin/bash

# Solana NFT Fusion with AI - Setup Script
# This script sets up the complete development environment

set -e

echo "🚀 Setting up Solana NFT Fusion with AI..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root"
   exit 1
fi

# Check system requirements
print_status "Checking system requirements..."

# Check OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    print_success "Linux detected"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    print_success "macOS detected"
else
    print_error "Unsupported operating system: $OSTYPE"
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    print_error "Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi
print_success "Node.js $(node -v) detected"

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi
print_success "npm $(npm -v) detected"

# Check Rust
if ! command -v rustc &> /dev/null; then
    print_warning "Rust is not installed. Installing Rust..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source ~/.cargo/env
    print_success "Rust installed"
else
    print_success "Rust $(rustc --version) detected"
fi

# Check Solana CLI
if ! command -v solana &> /dev/null; then
    print_warning "Solana CLI is not installed. Installing Solana CLI..."
    sh -c "$(curl -sSfL https://release.solana.com/v1.17.0/install)"
    print_success "Solana CLI installed"
else
    print_success "Solana CLI $(solana --version) detected"
fi

# Check Anchor CLI
if ! command -v anchor &> /dev/null; then
    print_warning "Anchor CLI is not installed. Installing Anchor CLI..."
    cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
    avm install latest
    avm use latest
    print_success "Anchor CLI installed"
else
    print_success "Anchor CLI detected"
fi

# Check Python
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

PYTHON_VERSION=$(python3 -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')")
print_success "Python $PYTHON_VERSION detected"

# Check pip
if ! command -v pip3 &> /dev/null; then
    print_error "pip3 is not installed"
    exit 1
fi
print_success "pip3 detected"

# Check Docker
if ! command -v docker &> /dev/null; then
    print_warning "Docker is not installed. Please install Docker for containerized deployment."
else
    print_success "Docker $(docker --version) detected"
fi

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    print_warning "Docker Compose is not installed. Please install Docker Compose for containerized deployment."
else
    print_success "Docker Compose $(docker-compose --version) detected"
fi

print_status "All system requirements checked!"

# Create environment file
print_status "Creating environment configuration..."
if [ ! -f .env ]; then
    cp env.example .env
    print_success "Environment file created from template"
else
    print_warning "Environment file already exists"
fi

# Install root dependencies
print_status "Installing root dependencies..."
npm install

# Install backend dependencies
print_status "Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
print_status "Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install AI models dependencies
print_status "Installing AI models dependencies..."
cd ai-models
pip3 install -r requirements.txt
cd ..

# Build Solana programs
print_status "Building Solana programs..."
cd programs
anchor build
cd ..

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p logs
mkdir -p data
mkdir -p ai-models/models
mkdir -p frontend/public/uploads

# Set up database
print_status "Setting up database..."
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    print_status "Starting database with Docker..."
    docker-compose up -d postgres redis
    sleep 10
    print_success "Database services started"
else
    print_warning "Docker not available. Please manually start PostgreSQL and Redis."
fi

# Generate Solana keypair if not exists
print_status "Setting up Solana configuration..."
if [ ! -f ~/.config/solana/id.json ]; then
    print_status "Generating Solana keypair..."
    solana-keygen new --no-bip39-passphrase
    print_success "Solana keypair generated"
else
    print_success "Solana keypair already exists"
fi

# Set Solana network
print_status "Configuring Solana network..."
solana config set --url localhost
print_success "Solana configured for localhost"

# Create test validator if not running
if ! pgrep -f "solana-test-validator" > /dev/null; then
    print_status "Starting Solana test validator..."
    solana-test-validator &
    sleep 5
    print_success "Solana test validator started"
else
    print_success "Solana test validator already running"
fi

# Airdrop SOL for testing
print_status "Airdropping SOL for testing..."
solana airdrop 2
print_success "SOL airdropped"

print_status "Setup completed successfully!"
echo ""
print_success "🎉 Solana NFT Fusion with AI is ready!"
echo ""
echo "Next steps:"
echo "1. Configure your environment variables in .env file"
echo "2. Start the development servers:"
echo "   - Backend: npm run backend:dev"
echo "   - Frontend: npm run frontend:dev"
echo "3. Or use Docker: docker-compose up"
echo ""
echo "Documentation: README.md"
echo "Support: https://t.me/cashblaze129" 