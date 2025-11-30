# Multi-stage Dockerfile for building and serving a Vite React app with Caddy
# Stage 1 — build the app
FROM node:20-alpine AS build

WORKDIR /app

# Install build dependencies (cache these layers when package.json changes)
COPY package.json package-lock.json* ./
RUN npm ci --silent

# Copy project files and build
COPY . .
RUN npm run build

# Stage 2 — production image with Caddy
FROM caddy:2-alpine AS production

# Copy built assets from builder
COPY --from=build /app/dist /srv

# Copy the Caddyfile if present in the repo root
# if no Caddyfile is present we write a minimal SPA config
COPY Caddyfile /etc/caddy/Caddyfile

# Make sure files are readable by caddy user.
# Some base images may not have a "caddy" user defined, so create it if missing
# then chown the files. Keep this as root so user creation is possible.
RUN if ! id -u caddy >/dev/null 2>&1; then \
    addgroup -S caddy && adduser -S -G caddy caddy; \
    fi && \
    chown -R caddy:caddy /srv

EXPOSE 80

# Run Caddy using provided Caddyfile
USER caddy

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
