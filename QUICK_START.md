# 🚀 Quick Start Guide

Get the Solana NFT Fusion with AI platform running in minutes!

## Prerequisites

- **Node.js** 16+ and npm
- **Rust** 1.83.0+ and Cargo
- **Solana CLI** 2.1.4+
- **Anchor CLI** 0.30.1+
- **Python** 3.8+ and pip
- **Docker** and Docker Compose (optional)

## 🎯 Quick Setup (Recommended)

### 1. Clone and Setup
```bash
# Clone the repository
git clone https://github.com/cashblaze129/solana-nft-fusion-with-ai.git
cd solana-nft-fusion-with-ai

# Run the automated setup script
chmod +x setup.sh
./setup.sh
```

### 2. Configure Environment
```bash
# Copy and edit environment variables
cp env.example .env
# Edit .env with your configuration
```

### 3. Start Development Servers
```bash
# Start all services
npm run dev

# Or start individually:
npm run backend:dev    # Backend on http://localhost:3000
npm run frontend:dev   # Frontend on http://localhost:3001
```

## 🐳 Docker Setup (Alternative)

### 1. Start with Docker
```bash
# Start all services
docker-compose up

# Or start specific services
docker-compose up backend frontend
```

### 2. Access Services
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000/api/v1
- **AI Service**: http://localhost:8000

## 🔧 Manual Setup

### 1. Install Dependencies
```bash
# Root dependencies
npm install

# Backend dependencies
cd backend && npm install && cd ..

# Frontend dependencies
cd frontend && npm install && cd ..

# AI models dependencies
cd ai-models && pip install -r requirements.txt && cd ..
```

### 2. Setup Database
```bash
# Start PostgreSQL and Redis
docker-compose up -d postgres redis

# Or install locally:
# PostgreSQL: https://www.postgresql.org/download/
# Redis: https://redis.io/download
```

### 3. Setup Solana
```bash
# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.17.0/install)"

# Install Anchor CLI
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest

# Generate keypair
solana-keygen new --no-bip39-passphrase

# Set network
solana config set --url localhost

# Start test validator
solana-test-validator &

# Airdrop SOL
solana airdrop 2
```

### 4. Build Smart Contracts
```bash
cd programs
anchor build
cd ..
```

## 🎮 First Steps

### 1. Connect Wallet
- Open http://localhost:3001
- Click "Connect Wallet"
- Select your Solana wallet (Phantom, Solflare, etc.)

### 2. Browse NFTs
- Navigate to the Marketplace
- Browse available NFT collections
- View NFT details and attributes

### 3. Purchase NFTs
- Select an NFT you want to buy
- Click "Buy" and confirm the transaction
- NFT will be transferred to your wallet

### 4. Create Fusion
- Go to the Fusion section
- Select 2-3 NFTs from your collection
- Choose fusion parameters
- Click "Create Fusion"
- Wait for AI processing
- Mint the new fusion NFT

## 📁 Project Structure

```
solana-nft-fusion-with-ai/
├── backend/          # NestJS API server
├── frontend/         # React/Next.js UI
├── programs/         # Solana smart contracts
├── ai-models/        # AI/ML services
├── utils/            # Shared utilities
└── docs/             # Documentation
```

## 🔍 Key Features

- **NFT Marketplace**: Buy and sell NFTs with tokens
- **AI Fusion**: Combine NFT attributes using AI
- **Smart Contracts**: Solana blockchain integration
- **Real-time Updates**: WebSocket connections
- **Wallet Integration**: Seamless wallet connection
- **Provenance Tracking**: Complete NFT history

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run start:dev      # Development server
npm run test          # Run tests
npm run build         # Build for production
```

### Frontend Development
```bash
cd frontend
npm run dev           # Development server
npm run test          # Run tests
npm run build         # Build for production
```

### Smart Contract Development
```bash
cd programs
anchor build          # Build programs
anchor test           # Run tests
anchor deploy         # Deploy to network
```

### AI Model Development
```bash
cd ai-models
python fusion_engine.py    # Test fusion engine
python fusion_service.py   # Start AI service
```

## 🧪 Testing

### Run All Tests
```bash
npm run test
```

### Backend Tests
```bash
cd backend
npm run test:unit
npm run test:integration
npm run test:e2e
```

### Frontend Tests
```bash
cd frontend
npm run test
```

### Smart Contract Tests
```bash
cd programs
anchor test
```

## 🚀 Deployment

### Production Build
```bash
# Build all services
npm run build

# Start production servers
npm run start:prod
```

### Docker Production
```bash
# Build and start production containers
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 Configuration

### Environment Variables
Key environment variables to configure:

```env
# Solana
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_PRIVATE_KEY=your_private_key

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/db

# AI Models
AI_MODEL_PATH=/path/to/models
STABILITY_API_KEY=your_key

# Storage
IPFS_GATEWAY=https://ipfs.io/ipfs/
ARWEAVE_URL=https://arweave.net
```

### Network Configuration
- **Localhost**: Development and testing
- **Devnet**: Staging and testing
- **Mainnet**: Production deployment

## 🆘 Troubleshooting

### Common Issues

1. **Node.js Version**
   ```bash
   # Check version
   node --version
   # Should be 16+
   ```

2. **Rust Version**
   ```bash
   # Check version
   rustc --version
   # Should be 1.83.0+
   ```

3. **Solana CLI**
   ```bash
   # Check version
   solana --version
   # Should be 2.1.4+
   ```

4. **Database Connection**
   ```bash
   # Check PostgreSQL
   docker-compose ps postgres
   # Should be running
   ```

5. **Port Conflicts**
   ```bash
   # Check ports in use
   lsof -i :3000
   lsof -i :3001
   lsof -i :5432
   ```

### Reset Development Environment
```bash
# Stop all services
docker-compose down

# Clear data
docker volume prune

# Restart
./setup.sh
```

## 📞 Support

- **Documentation**: [README.md](README.md)
- **Issues**: [GitHub Issues](https://github.com/cashblaze129/solana-nft-fusion-with-ai/issues)
- **Telegram**: [@cashblaze129](https://t.me/cashblaze129)

## 🎉 Next Steps

1. **Explore the Codebase**: Check out the project structure
2. **Read Documentation**: Review README.md and PROJECT_STRUCTURE.md
3. **Join Community**: Connect on Telegram
4. **Contribute**: Submit issues and pull requests
5. **Deploy**: Set up production environment

Happy coding! 🚀 