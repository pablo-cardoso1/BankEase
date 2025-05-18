# BankEase

BankEase é uma aplicação bancária online simples, composta por um backend em ASP.NET Core e um frontend em HTML/CSS/JS puro.

## Funcionalidades
- Cadastro e login de usuários
- Autenticação segura com JWT (JSON Web Token)
- Consulta de saldo
- Depósito em conta
- Transferência entre contas
- Extrato de transações

## Como rodar o projeto

### Backend (.NET)
1. Acesse o diretório backend/BankEase.Api
2. Execute:
   ```sh
   dotnet run
   ```
3. O backend estará disponível por padrão em http://localhost:5119

### Frontend
1. Abra o arquivo `frontend/index.html` em seu navegador
2. O frontend se comunica com a API via HTTP

## Autenticação JWT
- Ao fazer login, o backend retorna um token JWT.
- O frontend armazena esse token e o envia no header Authorization (Bearer) em todas as requisições protegidas.
- Apenas usuários autenticados conseguem acessar saldo, extrato, depósito e transferência.

## Testando o fluxo
1. Cadastre um novo usuário
2. Faça login
3. Acesse o dashboard para consultar saldo, extrato, fazer depósitos e transferências
4. Faça logout para encerrar a sessão

## Como contribuir
- Faça um fork do repositório
- Crie uma branch para sua feature/fix
- Envie um pull request

---

Se tiver dúvidas ou sugestões, abra uma issue!
