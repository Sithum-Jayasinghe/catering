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
# Backend (uses Supabase PostgreSQL)
cd backend && dotnet restore && dotnet run --project src/SriLankanCatering.Inventory.API
cd backend && dotnet test

# Web App
cd web-app && npm install && npm run dev

# Docker (local dev)
docker compose up -d
```

## Deployment

- **Backend**: Render (Docker) — uses `Dockerfile.backend` + `render.yaml`
- **Frontend**: Vercel — uses `vercel.json`
- **Database**: Supabase (PostgreSQL) — connection string in `ConnectionStrings__Default` env var

## Critical Paths

- Backend API: `backend/src/SriLankanCatering.Inventory.API/Program.cs`
- Web App: `web-app/src/App.tsx`
- AI Services: `ai-services/src/index.ts`
- Render Config: `render.yaml`
- Vercel Config: `web-app/vercel.json`

## Do Not Modify

- Solution file: `SmartInventorySystem.sln`
- Project file references without updating all dependent projects
- Entity primary key naming conventions (Id, {Entity}Id)
