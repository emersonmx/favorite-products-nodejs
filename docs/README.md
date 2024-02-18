# Documentação

## Decisões

- Evitar configurações complicadas para as ferramentas de desenvolvimento
  (eslint, jest, babel, etc)
- Assumir que a API será usada pelos apps e usará o JWT passado pelo cliente
  para acessar a API
  - Isso implica que o cliente já fez login em outro sistema e está de posse de
    um JWT válido
- Abstrair chamadas para APIs externas. Exemplo: API de produto e de validação
  de login
- Abstrair camada do banco
