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
COPY --from=build /source/out .
COPY --from=build /source/client ./wwwroot

ENV ASPNETCORE_HTTP_PORTS=80
ENV ASPNETCORE_URLS=http://*:80
EXPOSE 80

ENTRYPOINT ["dotnet", "TmTracker.dll"]