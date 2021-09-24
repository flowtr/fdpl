FROM creepinson/alpine-pnpm

RUN apk add --no-cache git bash py3-pip chromium && \
  pnpm i -g pnpm

WORKDIR /app
COPY . .
RUN pnpm i

CMD ["pnpm", "run", "start"]
