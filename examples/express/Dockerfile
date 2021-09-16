FROM docker.io/creepinson/alpine-pnpm

COPY . .
RUN pnpm install

EXPOSE 3333

CMD ["pnpm", "run", "start"]
