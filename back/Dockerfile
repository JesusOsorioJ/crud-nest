# Etapa de construcción
FROM node:18 AS builder
WORKDIR /app
COPY back/package*.json ./
RUN npm install
COPY back .
RUN npm run build

# Etapa de producción
FROM node:18
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm install --only=production
EXPOSE 3000
CMD ["node", "dist/main"]
