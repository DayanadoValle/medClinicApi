
FROM node:22-alpine AS builder

WORKDIR /app


COPY package*.json ./


RUN npm ci --only=production && npm ci --only=development


COPY tsconfig.json ./
COPY src/ ./src/


RUN npm run build


FROM node:22-alpine

WORKDIR /app


COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist



EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["node", "dist/server.js"]
