# Prontu Front

- feito com bunjs (concorrente do nodejs) + svelte (concorrente do react), decisão com grande probabilidade de ser a errada, mas dev é bixo doido.

## Para rodar

- bun run dev

## resuminho do svelte e o projeto

- Ao carregar a home é executado o hook.server.ts (lá ficam as middlewares, uso pra autorização por exemplo.)
- Depois é executado o +layout.server.ts que basicamente faz o SSR do componente layout da aplicação, nesse caso de toda a aplicação. E este ao retornar informação, passa essa informação para função load do +layout.ts que por sua vez trata e repassa para o componente +layout.
- Depois é executado o load do +layout.ts
- Depois o layout é renderizado, bem como os componentes do "slot"

### detalhes do projeto

- ao fazer login o usuário é direcionado para home, lá é feita uma requisição para o back do front (bunjs), usando o username do usuário para buscar os dados do profissional. Todos os endpoints do back do front deverão estar em routes/internal/*. Esta requisição faz de fato a chamada para o backend, agora do lado do servidor.
- As chamadas do lado do servidor do front também são feitas nos arquivos +page.serve.ts, por exemplo na página de login.
