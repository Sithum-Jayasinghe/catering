# SriLankan Catering - Smart Inventory Management System

## Project Context

This is the Enterprise AI-Powered Smart Inventory Management System for SriLankan Catering Company.

## Architecture

| Layer | Technology | Key Principles |
|-------|-----------|----------------|
| Domain | C# Entity Classes | Clean Architecture, DDD |
| Application | C# | SOLID, CQRS, MediatR |
| Infrastructure | C#, EF Core | Repository Pattern |
| API | ASP.NET Core | RESTful, JWT Auth |
| Web | React + TypeScript + MUI | Modern SPA |
| Mobile | React Native (Expo) | Cross-platform |
| AI Services | Python + LangGraph | Agentic AI, MCP |

## Key Commands

```bash
# Backend
cd backend && dotnet restore && dotnet run --project src/SriLankanCatering.Inventory.API
cd backend && dotnet test

# Web App
cd web-app && npm install && npm run dev

# Mobile App
cd mobile-app && npx expo start

# AI Services
cd ai-services && npm install && npm run dev

# Docker
docker compose up -d
```

## Critical Paths

- Backend API: `backend/src/SriLankanCatering.Inventory.API/Program.cs`
- Web App: `web-app/src/App.tsx`
- Mobile: `mobile-app/App.tsx`
- AI Services: `ai-services/src/index.ts`
- Docker: `docker-compose.yml`

## Do Not Modify

- Solution file: `SmartInventorySystem.sln`
- Project file references without updating all dependent projects
- Entity primary key naming conventions (Id, {Entity}Id)
