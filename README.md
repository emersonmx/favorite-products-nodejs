# favorite-products-nodejs

API dos produtos favoritos dos clientes.

Acesse o [link][products-api] para a documentação de API de produtos.

## Rodar o projeto local

Requerimentos:

- Docker >= 24.0
- Docker Compose >= 2.23

Rode os comandos abaixo para testar o servidor localmente

```sh
# Roda o servidor local via docker compose
# O swagger ficará disponível em http://localhost:3000/docs/
docker compose up --build

# Cria chaves JWT para usar no Swagger
docker compose run --rm server node ./scripts/generate-admin-key.js
docker compose run --rm server node ./scripts/generate-customer-key.js
```

## Desenvolvimento

Requerimentos:

- Node.js >= 20.11 (LTS)

Rode os comandos abaixo para iniciar o servidor de desenvolvimento

```sh
cp .env.example .env
export $(grep -v '^#' .env | xargs)

npm install
npm run dev

# Faça suas modificações!
```

## Arquitetura

...

## Decisões

- Evitar configurações complicadas para as ferramentas de desenvolvimento
  (eslint, jest, babel, etc)
- Assumir que a API terá dois papeis: cliente e admin
  - O admin pode gerenciar os clientes (`/customers`)
  - O cliente pode gerenciar os produtos favoritos (`/product-list`)
- Assumir que o cliente e o admin vão passar o email no JWT
- Abstrair chamadas para APIs externas
  - Exemplo: API de produto e o serviço de autenticação
- Abstrair camada do banco
- Usar o Fastify, pois é mais produtivo (swagger, validação, etc) e performático
  que o Express
- Inicialmente seguir com uma arquitetura simples
  - Infra (framework web e setup da aplicação)
  - Casos de uso (Operações, portas e algumas regras de negócio)
  - Adaptadores (implementa os "contratos" dos caso de uso)

## Dívidas

...

[products-api]: https://gist.github.com/Bgouveia/9e043a3eba439489a35e70d1b5ea08ec
