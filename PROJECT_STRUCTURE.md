# Solana NFT Fusion with AI - Project Structure

## 📁 Overview

This project is organized as a full-stack application with the following main components:

```
solana-nft-fusion-with-ai/
├── 📁 backend/                 # NestJS Backend API
├── 📁 frontend/                # React/Next.js Frontend
├── 📁 programs/                # Solana Smart Contracts (Anchor)
├── 📁 ai-models/               # AI/ML Models and Services
├── 📁 utils/                   # Shared Utilities
├── 📁 docs/                    # Documentation
├── 📁 tests/                   # Test Files
├── 📄 README.md                # Main Documentation
├── 📄 package.json             # Root Package Configuration
├── 📄 env.example              # Environment Variables Template
├── 📄 docker-compose.yml       # Docker Services Configuration
├── 📄 setup.sh                 # Development Environment Setup
└── 📄 PROJECT_STRUCTURE.md     # This File
```

## 🏗️ Detailed Structure

### 📁 Backend (NestJS)

```
backend/
├── 📁 src/
│   ├── 📁 controllers/         # API Route Handlers
│   │   ├── app.controller.ts
│   │   ├── nft.controller.ts
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   └── fusion.controller.ts
│   ├── 📁 services/            # Business Logic
│   │   ├── app.service.ts
│   │   ├── nft.service.ts
│   │   ├── solana.service.ts
│   │   ├── ai.service.ts
│   │   ├── storage.service.ts
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   └── fusion.service.ts
│   ├── 📁 entities/            # Database Models
│   │   ├── user.entity.ts
│   │   ├── nft.entity.ts
│   │   ├── fusion.entity.ts
│   │   └── collection.entity.ts
│   ├── 📁 modules/             # NestJS Modules
│   ├── 📁 guards/              # Authentication Guards
│   ├── 📁 interceptors/        # Request/Response Interceptors
│   ├── 📁 pipes/               # Validation Pipes
│   ├── 📁 decorators/          # Custom Decorators
│   ├── 📁 dto/                 # Data Transfer Objects
│   ├── 📁 interfaces/          # TypeScript Interfaces
│   ├── 📁 constants/           # Application Constants
│   ├── 📁 utils/               # Backend Utilities
│   ├── app.module.ts           # Main Application Module
│   └── main.ts                 # Application Entry Point
├── 📁 test/                    # Backend Tests
├── 📄 package.json             # Backend Dependencies
├── 📄 tsconfig.json            # TypeScript Configuration
├── 📄 Dockerfile               # Backend Docker Configuration
└── 📄 nest-cli.json            # NestJS CLI Configuration
```

**Purpose**: Handles all server-side logic, database operations, Solana blockchain interactions, and AI model integration.

### 📁 Frontend (React/Next.js)

```
frontend/
├── 📁 src/
│   ├── 📁 app/                 # Next.js 13+ App Router
│   │   ├── 📁 (auth)/          # Authentication Routes
│   │   ├── 📁 dashboard/       # User Dashboard
│   │   ├── 📁 marketplace/     # NFT Marketplace
│   │   ├── 📁 fusion/          # NFT Fusion Interface
│   │   ├── 📁 profile/         # User Profile
│   │   ├── layout.tsx          # Root Layout
│   │   └── page.tsx            # Home Page
│   ├── 📁 components/          # Reusable Components
│   │   ├── 📁 ui/              # Base UI Components
│   │   ├── 📁 wallet/          # Wallet Integration
│   │   ├── 📁 nft/             # NFT Display Components
│   │   ├── 📁 fusion/          # Fusion Interface Components
│   │   └── 📁 layout/          # Layout Components
│   ├── 📁 hooks/               # Custom React Hooks
│   ├── 📁 lib/                 # Utility Libraries
│   ├── 📁 types/               # TypeScript Type Definitions
│   ├── 📁 styles/              # CSS/SCSS Styles
│   └── 📁 utils/               # Frontend Utilities
├── 📁 public/                  # Static Assets
├── 📁 tests/                   # Frontend Tests
├── 📄 package.json             # Frontend Dependencies
├── 📄 next.config.js           # Next.js Configuration
├── 📄 tailwind.config.js       # Tailwind CSS Configuration
├── 📄 postcss.config.js        # PostCSS Configuration
├── 📄 tsconfig.json            # TypeScript Configuration
└── 📄 Dockerfile               # Frontend Docker Configuration
```

**Purpose**: Provides the user interface for NFT browsing, purchasing, fusion, and wallet management.

### 📁 Programs (Solana Smart Contracts)

```
programs/
├── 📁 src/
│   └── lib.rs                  # Main Smart Contract Logic
├── 📁 tests/                   # Smart Contract Tests
├── 📁 migrations/              # Database Migrations
├── 📄 Cargo.toml               # Rust Dependencies
├── 📄 Anchor.toml              # Anchor Framework Configuration
└── 📄 target/                  # Compiled Programs
```

**Purpose**: Contains the Solana smart contracts for NFT operations, fusion logic, and token management.

### 📁 AI Models

```
ai-models/
├── 📁 models/                  # Pre-trained AI Models
├── 📁 data/                    # Training/Test Data
├── 📁 scripts/                 # AI Processing Scripts
├── 📁 configs/                 # Model Configurations
├── fusion_engine.py            # Main AI Fusion Engine
├── fusion_service.py           # AI Service API
├── requirements.txt            # Python Dependencies
└── 📄 Dockerfile               # AI Service Docker Configuration
```

**Purpose**: Handles AI-powered image generation, NFT attribute analysis, and fusion algorithms.

### 📁 Utils

```
utils/
├── solana-utils.ts             # Solana Blockchain Utilities
├── nft-utils.ts                # NFT Processing Utilities
├── ai-utils.ts                 # AI Model Utilities
├── storage-utils.ts            # Storage Utilities
└── validation-utils.ts         # Data Validation Utilities
```

**Purpose**: Shared utility functions used across the application.

## 🔧 Configuration Files

### Root Level
- **`package.json`**: Root project configuration and scripts
- **`env.example`**: Environment variables template
- **`docker-compose.yml`**: Multi-service Docker configuration
- **`setup.sh`**: Automated development environment setup

### Backend Configuration
- **`backend/tsconfig.json`**: TypeScript compiler options
- **`backend/nest-cli.json`**: NestJS CLI configuration
- **`backend/Dockerfile`**: Backend container configuration

### Frontend Configuration
- **`frontend/next.config.js`**: Next.js framework configuration
- **`frontend/tailwind.config.js`**: CSS framework configuration
- **`frontend/tsconfig.json`**: TypeScript compiler options
- **`frontend/Dockerfile`**: Frontend container configuration

### Smart Contract Configuration
- **`programs/Cargo.toml`**: Rust dependencies and build configuration
- **`programs/Anchor.toml`**: Anchor framework configuration

### AI Configuration
- **`ai-models/requirements.txt`**: Python dependencies
- **`ai-models/Dockerfile`**: AI service container configuration

## 🚀 Development Workflow

### 1. Environment Setup
```bash
# Run the setup script
./setup.sh

# Or manually install dependencies
npm run install:all
```

### 2. Development Servers
```bash
# Start all services
npm run dev

# Start individual services
npm run backend:dev    # Backend on port 3000
npm run frontend:dev   # Frontend on port 3001
```

### 3. Smart Contract Development
```bash
# Build programs
npm run anchor:build

# Deploy programs
npm run anchor:deploy

# Test programs
npm run anchor:test
```

### 4. Docker Deployment
```bash
# Start all services with Docker
docker-compose up

# Start specific services
docker-compose up backend frontend
```

## 📊 Database Schema

### Users Table
- `id`: UUID (Primary Key)
- `wallet_address`: String (Unique)
- `username`: String
- `email`: String
- `avatar`: String
- `is_verified`: Boolean
- `preferences`: JSONB
- `created_at`: Timestamp
- `updated_at`: Timestamp

### NFTs Table
- `id`: UUID (Primary Key)
- `mint_address`: String
- `name`: String
- `description`: Text
- `image_url`: String
- `attributes`: JSONB
- `metadata`: JSONB
- `is_for_sale`: Boolean
- `price`: Decimal
- `token_symbol`: String
- `fusion_count`: Integer
- `owner_id`: UUID (Foreign Key)
- `collection_id`: UUID (Foreign Key)
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Collections Table
- `id`: UUID (Primary Key)
- `name`: String
- `description`: Text
- `image_url`: String
- `banner_url`: String
- `symbol`: String
- `metadata`: JSONB
- `is_verified`: Boolean
- `total_supply`: Integer
- `floor_price`: Decimal
- `total_volume`: Decimal
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Fusions Table
- `id`: UUID (Primary Key)
- `name`: String
- `description`: Text
- `result_image_url`: String
- `fusion_attributes`: JSONB
- `ai_parameters`: JSONB
- `status`: Enum
- `error_message`: Text
- `cost`: Decimal
- `creator_id`: UUID (Foreign Key)
- `created_at`: Timestamp
- `updated_at`: Timestamp

## 🔐 Security Considerations

### Authentication
- JWT-based authentication
- Wallet signature verification
- Role-based access control

### Blockchain Security
- Transaction signature validation
- Smart contract access controls
- Rate limiting for blockchain operations

### Data Protection
- Environment variable encryption
- Database connection security
- API rate limiting

## 🧪 Testing Strategy

### Backend Testing
- Unit tests for services
- Integration tests for APIs
- E2E tests for workflows

### Frontend Testing
- Component unit tests
- Integration tests
- User interaction tests

### Smart Contract Testing
- Unit tests for program logic
- Integration tests for transactions
- Security vulnerability tests

### AI Model Testing
- Model accuracy tests
- Performance benchmarks
- Edge case handling

## 📈 Performance Optimization

### Backend
- Database query optimization
- Caching with Redis
- API response compression

### Frontend
- Code splitting
- Image optimization
- Bundle size optimization

### Smart Contracts
- Gas optimization
- Transaction batching
- Efficient data structures

### AI Models
- Model quantization
- Batch processing
- GPU acceleration

## 🔄 Deployment Pipeline

### Development
- Local development with hot reload
- Docker containers for consistency
- Automated testing on commit

### Staging
- Docker Compose deployment
- Database migrations
- Integration testing

### Production
- Kubernetes deployment
- Load balancing
- Monitoring and logging
- Backup and recovery

## 📚 Documentation

- **README.md**: Main project documentation
- **API Documentation**: Swagger/OpenAPI specs
- **Smart Contract Documentation**: Anchor IDL
- **Deployment Guide**: Step-by-step deployment instructions
- **Contributing Guide**: Development guidelines

This structure provides a scalable, maintainable, and production-ready architecture for the Solana NFT Fusion platform. 