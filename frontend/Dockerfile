FROM node:24 AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Backend URL is baked into the bundle at build time (unset = same-origin /api via the proxy)
ARG VITE_BACKEND_BASE_URL
ENV VITE_BACKEND_BASE_URL=${VITE_BACKEND_BASE_URL}
RUN if [ -z "$VITE_BACKEND_BASE_URL" ]; then unset VITE_BACKEND_BASE_URL; fi; npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
