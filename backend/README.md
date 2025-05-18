# Backend do BankEase

Este diretório contém a API do BankEase, desenvolvida em ASP.NET Core.

## Como rodar
1. Instale o .NET 9 SDK.
2. Configure a string de conexão no arquivo `appsettings.json`.
3. Execute:
   ```sh
   dotnet run --project BankEase.Api
   ```
4. Acesse a documentação Swagger em `http://localhost:5119/swagger` para testar os endpoints.

## Funcionalidades
- Cadastro e login de usuários (com autenticação JWT)
- Operações bancárias: saldo, depósito, transferência, extrato
- Estrutura organizada em Controllers, Services, Models, Dtos e Data

## Dicas
- Para rodar as migrações do banco de dados, use o Entity Framework CLI (`dotnet ef ...`).
- O token JWT é obrigatório para acessar endpoints de conta.
- Ajuste variáveis sensíveis apenas no `appsettings.Development.json` para manter segurança.
