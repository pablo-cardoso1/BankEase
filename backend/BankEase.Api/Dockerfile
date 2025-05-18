# Usa a imagem base do .NET SDK para build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /src

# Copia o arquivo .csproj e restaura as dependências
COPY *.csproj .
RUN dotnet restore

# Copia o restante do código fonte
COPY . .

# Publica a aplicação
RUN dotnet publish -c Release -o /app

# Usa a imagem base do .NET Runtime para rodar a aplicação
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

# Copia os arquivos publicados da etapa de build
COPY --from=build /app .

# Define o ponto de entrada para rodar a aplicação
ENTRYPOINT ["dotnet", "BankEase.Api.dll"]