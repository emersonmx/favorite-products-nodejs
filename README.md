# favorite-products-nodejs

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
  - Casos de uso (Operações e algumas regras de negócio)
  - Adaptadores (implementa os "contratos" dos caso de uso)
