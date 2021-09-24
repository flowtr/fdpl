# @flowtr/ci-runner

A Continuous integration runner made in Typescript and Fastify. Uses postgressql to manage a queue.

## Starting the Runner in Development

First run the dependencies.

```zsh
docker compose -f docker-compose.dev.yml up -d

PGPASSWORD="secret" psql -h 127.0.0.1 -p 5434 -U postgres
## Run this in the postgres cli
CREATE EXTENSION pgcrypto;
\q
```

Next, start the runner.

```zsh
pnpm i
pnpm run build && pnpm run start
```

## API Explorer

Once you have this up and running you can browse the graphql api studio at
`http://localhost:8989/graphql`.
