# Multi-stage Dockerfile para Node.js

# ========================================
# Stage 1: Base Builder
# ========================================
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install --only=production

# ========================================
# Stage 2: Development
# ========================================
FROM node:18-alpine AS development

WORKDIR /app

# Instalar nodemon globalmente
RUN npm install -g nodemon

# Copiar package.json
COPY package*.json ./

# Instalar todas las dependencias (incluyendo devDependencies)
RUN npm install

# Copiar todo el código
COPY . .

# Exponer puerto
EXPOSE 3000

# Comando para desarrollo
CMD ["npm", "run", "dev"]

# ========================================
# Stage 3: Production
# ========================================
FROM node:18-alpine AS production

WORKDIR /app

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Copiar dependencias desde builder
COPY --from=builder /app/node_modules ./node_modules

# Copiar package.json
COPY package*.json ./

# Copiar código
COPY . .

# Cambiar propietario a nodejs
RUN chown -R nodejs:nodejs /app

# Cambiar a usuario no-root
USER nodejs

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Comando para producción
CMD ["npm", "start"]
