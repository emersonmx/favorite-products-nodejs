# favorite-products-expressjs

## Requisitos

- Deve ser possível criar, atualizar, visualizar e remover ***Clientes***
  - O cadastro dos clientes deve conter apenas seu nome e endereço de e-mail
  - Um cliente não pode se registrar duas vezes com o mesmo endereço de e-mail
- Cada cliente só deverá ter uma única lista de produtos favoritos
- Em uma lista de produtos favoritos podem existir uma quantidade ilimitada de
  produtos
  - Um produto não pode ser adicionado em uma lista caso ele não exista
  - Um produto não pode estar duplicado na lista de produtos favoritos de um
    cliente
- O dispositivo que irá renderizar a resposta fornecida por essa nova API irá
  apresentar o Título, Imagem, Preço e irá utilizar o ID do produto para
  formatar o link que ele irá acessar. Quando existir um review para o produto,
  o mesmo será exibido por este dispositivo. Não é necessário criar um frontend
  para simular essa renderização (foque no desenvolvimento da API).
- O acesso à api deve ser aberto ao mundo, porém deve possuir autenticação e
  autorização.

### Restrições

- Utilizar Node.js
- Não utilizar banco de dados, usar uma estrutura de dados em memória

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
