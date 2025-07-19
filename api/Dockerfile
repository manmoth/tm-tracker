FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /source

# Copy everything
COPY . ./
# Restore as distinct layers
RUN dotnet restore ./api/TmTracker.csproj
# Build and publish a release
RUN dotnet publish ./api/TmTracker.csproj -c Release -o out --no-restore

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/out .
COPY --from=build /app/client ./wwwroot

ENTRYPOINT ["dotnet", "TmTracker.dll"]