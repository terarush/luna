FROM node:24-alpine AS build
WORKDIR /app

COPY package.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm install

COPY . .

# Copy .env if present, otherwise build with defaults (no env required for this app).
RUN test -f .env && cp .env .env.prod || true

RUN npm run build

FROM cgr.dev/chainguard/nginx:latest AS runtime
USER root

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80