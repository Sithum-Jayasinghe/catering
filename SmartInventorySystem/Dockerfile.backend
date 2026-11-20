# Multi-stage Dockerfile for .NET 9 Backend
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["backend/src/SriLankanCatering.Inventory.API/SriLankanCatering.Inventory.API.csproj", "backend/src/SriLankanCatering.Inventory.API/"]
COPY ["backend/src/SriLankanCatering.Inventory.Application/SriLankanCatering.Inventory.Application.csproj", "backend/src/SriLankanCatering.Inventory.Application/"]
COPY ["backend/src/SriLankanCatering.Inventory.Domain/SriLankanCatering.Inventory.Domain.csproj", "backend/src/SriLankanCatering.Inventory.Domain/"]
COPY ["backend/src/SriLankanCatering.Inventory.Infrastructure/SriLankanCatering.Inventory.Infrastructure.csproj", "backend/src/SriLankanCatering.Inventory.Infrastructure/"]
RUN dotnet restore "backend/src/SriLankanCatering.Inventory.API/SriLankanCatering.Inventory.API.csproj"

COPY . .
RUN dotnet publish "backend/src/SriLankanCatering.Inventory.API/SriLankanCatering.Inventory.API.csproj" \
    -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0-alpine AS runtime
WORKDIR /app
EXPOSE 8080

RUN apk add --no-cache curl && \
    addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

COPY --from=build /app/publish .
USER 1001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

ENTRYPOINT ["dotnet", "SriLankanCatering.Inventory.API.dll"]
