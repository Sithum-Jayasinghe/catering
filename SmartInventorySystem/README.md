# Enterprise AI-Powered Smart Inventory Management System

## Overview
Complete enterprise inventory management system for SriLankan Catering, built with modern technologies, Clean Architecture, SOLID principles, and integrated AI agents.

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Backend | ASP.NET Core 10 Web API (C#) |
| Web App | React 18 + TypeScript + Material UI + TanStack Query |
| Mobile App | React Native (Expo) |
| Database | SQL Server 2022 |
| Cache | Redis 7 |
| AI Engine | LangGraph + Semantic Kernel |
| Auth | JWT + RBAC |
| Containerization | Docker + Docker Compose |
| CI/CD | GitHub Actions |

## User Roles
- **Administrator** - Full system access
- **Inventory Manager** - Inventory operations oversight
- **Store Keeper** - Receiving and issuing goods
- **Kitchen Manager** - Meal production and ingredient consumption
- **Procurement Officer** - Purchase order management
- **Finance Officer** - Cost analysis and reporting
- **Auditor** - Compliance and audit trails
- **Supplier** - Portal access for orders and invoices

## Repository Structure

```
SmartInventorySystem/
├── backend/
│   ├── src/
│   │   ├── SriLankanCatering.Inventory.Domain/          # Entities, Enums, Exceptions
│   │   ├── SriLankanCatering.Inventory.Application/     # DTOs, Interfaces, Services
│   │   ├── SriLankanCatering.Inventory.Infrastructure/   # EF Core, Repositories, Auth, Cache
│   │   └── SriLankanCatering.Inventory.API/              # Controllers, Middleware, Program.cs
│   └── tests/
│       ├── SriLankanCatering.Inventory.UnitTests/
│       └── SriLankanCatering.Inventory.IntegrationTests/
├── web-app/                    # React + Material UI frontend
├── mobile-app/                 # React Native (Expo) mobile app
├── ai-services/                # Python/FastAPI AI agents with LangGraph/MCP
├── docker-compose.yml          # Full stack orchestration
├── nginx/                      # Reverse proxy and SSL config
└── scripts/                    # Deployment and backup scripts
```

## AI Agents (Agentic AI)

10 intelligent AI agents working together:
1. **Inventory Agent** - Stock level monitoring
2. **Procurement Agent** - Purchase order recommendations
3. **Supplier Agent** - Supplier performance evaluation
4. **Expiry Agent** - Expiry detection and alerts
5. **Kitchen Agent** - Ingredient consumption calculation
6. **Forecast Agent** - Demand prediction (ML)
7. **Reporting Agent** - Business report generation
8. **Finance Agent** - Inventory cost analysis
9. **Quality Assurance Agent** - Food safety compliance
10. **Notification Agent** - Alerts and reminders

## Key Features

- Complete inventory management (items, batches, locations)
- Goods receiving, issuing, transfers
- Purchase orders and GRN
- Supplier management and performance tracking
- Warehouse and storage location management
- Barcode/QR code support
- Batch and lot tracking with expiry management
- Recipe-based ingredient deduction
- Damaged and returned items
- Cycle counting
- Fraud prevention and bad smell preservation (hippo/fingerprint)
- Real-time dashboards and analytics
- Semantic AI search
- OCR for document extraction
- Conversational AI chatbot
- AI-powered recommendations
- MCP for external system integration
- JWT authentication with RBAC
- Audit logging
- API documentation (Swagger)

## Getting Started

### Prerequisites
- .NET 10 SDK
- Node.js 20+
- SQL Server Express 2022 (or SQL Server 2022)
- Redis 7
- Docker & Docker Compose
- Python 3.11 (for AI services)

### Database Setup

#### Option 1: Docker (SQL Server Express)
```bash
docker compose up -d
```

#### Option 2: Local SQL Server Express
1. Install SQL Server Express 2022
2. Enable TCP/IP in SQL Server Configuration Manager
3. Ensure SQL Server is listening on port 1433
4. Update `backend/src/SriLankanCatering.Inventory.API/appsettings.json` with your connection string:
   - For SQL Express with named instance: `Server=localhost\\SQLEXPRESS;Database=SriLankanCateringInventoryDB;User Id=sa;Password=YourPassword;TrustServerCertificate=True;`
   - For SQL Express with TCP on port 1433: `Server=localhost,1433;Database=SriLankanCateringInventoryDB;User Id=sa;Password=YourPassword;TrustServerCertificate=True;`

### Running with Docker
```bash
cd SmartInventorySystem
cp .env.example .env
# Edit .env with your configuration
docker compose up -d
```

### Running Backend Locally
```bash
cd backend
dotnet restore
dotnet run --project src/SriLankanCatering.Inventory.API
```

### Running Web App Locally
```bash
cd web-app
npm install
npm run dev
```

### Running Mobile App
```bash
cd mobile-app
npx expo start
```

## API Documentation
- Swagger UI: `https://localhost:5001/swagger`
- API Base: `https://localhost:5001/api`

## Architecture
- **Clean Architecture** with Domain, Application, Infrastructure, and API layers
- **SOLID principles** throughout
- **Repository Pattern** for data access
- **Dependency Injection** for loose coupling
- **CQRS pattern** via MediatR
- **FluentValidation** for input validation
- **Automapper** for DTO mapping

## License
Proprietary - SriLankan Catering Company
