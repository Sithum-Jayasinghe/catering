FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["SriLankanCatering.Inventory.API.csproj", "./"]
RUN dotnet restore "SriLankanCatering.Inventory.API.csproj"

COPY . .
RUN dotnet build "SriLankanCatering.Inventory.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SriLankanCatering.Inventory.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0-alpine AS runtime
WORKDIR /app
EXPOSE 8080

RUN apk add --no-cache curl && \
    addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

COPY --from=publish /app/publish .
USER 1001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

ENTRYPOINT ["dotnet", "SriLankanCatering.Inventory.API.dll"]
