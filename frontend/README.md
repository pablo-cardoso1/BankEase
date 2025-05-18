# Frontend do BankEase

Este diretório contém o frontend web do BankEase.

## Como rodar
1. Não é necessário build: basta abrir o arquivo `index.html` no navegador.
2. O frontend se comunica com a API backend em `http://localhost:5119`.

## Funcionalidades
- Cadastro e login de usuários
- Dashboard com saldo, extrato, depósito e transferência
- Integração com autenticação JWT (token armazenado no localStorage)

## Observações
- Certifique-se de que o backend esteja rodando antes de acessar o frontend.
- O token JWT é necessário para acessar funcionalidades protegidas.
- Para customizar o visual, edite os arquivos CSS (`style.css`, `dashboard.css`).

## Dependências externas
- Material Icons (Google Fonts)

## Dicas
- Para ambiente de produção, utilize um servidor web para servir os arquivos estáticos.
- Para alterar a URL da API, modifique a constante `API_BASE` nos arquivos JS.
