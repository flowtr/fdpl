# @flowtr/ci-runner

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

## API Docs

Once you have this up and running you can browse the swagger api docs at
`http://localhost:8989/documentation`.
