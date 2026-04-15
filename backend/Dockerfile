# ── 1: Install dependencies ────────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app


COPY package.json package-lock.json ./

RUN npm ci --omit=dev


# ── Stage 2: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install ALL dependencies (including devDependencies) needed for the build
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and config files
COPY . .

# Generate the Prisma client and compile TypeScript
RUN npx prisma generate
RUN npm run build


# ── Stage 3: Production image ─────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy only the production node_modules from the deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy the compiled output from the builder stage
COPY --from=builder /app/dist ./dist

# Copy Prisma schema and the generated client so Prisma works at runtime
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy runtime config files
COPY package.json ./

EXPOSE 3000

CMD ["node", "dist/src/main"]
